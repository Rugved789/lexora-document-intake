# Lexora — AI Engineering & Development Log

This document records the architectural decisions, prompt engineering iterations, contradiction detection mechanisms, and lessons learned during the design of Lexora's AI conversational intake engine.

---

## 1. Executive AI Mission

The central mission of Lexora's AI layer is:
> **Convert messy, nuanced human dialogue into legally sound, deterministic structured state without ever assuming, inventing, or losing facts.**

In legal and fiduciary document preparation, standard chatbot behavior (creative elaboration, guessing missing details, conversational hallucination) is a liability. Lexora enforces a strict **Zero-Assumption Contract**.

---

## 2. Model Selection & Infrastructure Evolution

### Phase 1: Local Inference Exploration (Ollama + Gemma 3 12B)
- **Concept**: Run models completely locally using Ollama for strict data privacy.
- **Observations**:
  - *Pros*: Complete offline capability; zero data egress.
  - *Cons*: High latency on machines without dedicated GPU acceleration (5–12 seconds per turn); high system memory footprint; inconsistent cold-start times.

### Phase 2: High-Throughput LPU Cloud Inference (Groq + GPT-OSS 120B / Llama 3.3 70B)
- **Solution**: Migrated primary production provider to **Groq Cloud API** using LPU (Language Processing Unit) architecture.
- **Observations**:
  - *Inference Velocity*: Sub-second response generation (~400–750 tokens/sec).
  - *Model*: `openai/gpt-oss-120b` (or `llama-3.3-70b-versatile`).
  - *Impact*: Reduced conversation turnaround from 8 seconds to ~450ms, making conversational document generation feel instantaneous and responsive.
  - *Reliability*: Strict JSON schema mode enforced via API parameters.

### Phase 3: Deterministic Test Harness (`MockLLMProvider`)
- **Requirement**: Automated unit tests and offline development must never fail due to API rate limits, network outages, or non-deterministic token distributions.
- **Solution**: Developed `MockLLMProvider` using regular expressions, keyword tokenizers, and rule-based state diff generators.
- **Result**: 100% offline development capability; fast unit test suite execution (~150ms).

---

## 3. System Prompt Engineering

The system prompt is dynamically assembled in `GroqProvider.js` and injects the **current structured state** as context into every turn.

### Prompt Template:
```markdown
You are an assistant helping collect information for a personal wishes document.

**Current Information:**
{JSON_CURRENT_STATE}

**Your Task:**
1. Extract structured information from the user's message
2. Identify what information is still needed
3. Detect contradictions with existing information
4. Never invent or assume information

**Response Format:**
You must respond with valid JSON in this exact format:
{
  "assistantMessage": "Your conversational response to the user",
  "stateUpdates": {
    "field_name": "value"
  },
  "clarificationRequired": false,
  "clarificationReason": null,
  "fieldsNeedingClarification": [],
  "confidence": "high" | "medium" | "low"
}

**Rules:**
- Extract ONLY information explicitly stated by the user
- If user mentions someone as executor, extract:
  "executor": { "name": "...", "relationship": "..." }
- If user mentions children, extract:
  "has_children": true,
  "children": [{ "name": "...", "date_of_birth": null }]
- If user says they have no children, extract:
  "has_children": false,
  "children": []
- If user contradicts previous info, set clarificationRequired to true
- Keep assistantMessage conversational, empathetic, and clear
- Do NOT include markdown formatting (like ```json) in your response, just the raw JSON
```

---

## 4. Key AI Engineering Invariants

### 1. Delta-Based State Updates (Diffs)
- **Anti-Pattern**: Asking the LLM to output the entire cumulative state on each turn.
  - *Failure Mode*: In long conversations, the LLM drops earlier fields (e.g., omitting `home_address` when discussing funeral wishes).
- **Lexora Pattern**: The LLM outputs only `stateUpdates` representing fields newly provided or corrected in the current turn.
- **Backend Merger**: The server merges updates through Zod validators into the immutable persistent state.

### 2. Contradiction Detection Algorithm
The LLM evaluates the latest user message against the `currentState` object injected into the prompt:

```
User Message: "Actually, I don't have any children."
                    │
                    ▼
Current State Check: { has_children: true, children: ["Alice", "Bob"] }
                    │
                    ▼ Conflict Flagged!
{
  "assistantMessage": "You previously mentioned having two children, Alice and Bob. To make sure your records are completely accurate, could you clarify whether you'd like to update or remove them?",
  "stateUpdates": {},
  "clarificationRequired": true,
  "clarificationReason": "User previously declared children (Alice, Bob) but now states they have no children.",
  "fieldsNeedingClarification": ["has_children", "children"],
  "confidence": "medium"
}
```
Because `clarificationRequired` is `true`, the backend **holds the existing state intact** and flags the fields in the UI until the user explicitly resolves the conflict.

### 3. Multi-Field Extraction in a Single Turn
Users often answer in dense, natural sentences:
> *"Hi, my name is Eleanor Vance, I live in Boston at 45 Beacon St, and I have one son named Henry."*

The model extracts all three facets simultaneously:
```json
{
  "stateUpdates": {
    "full_name": "Eleanor Vance",
    "home_address": "45 Beacon St, Boston",
    "has_children": true,
    "children": [{ "name": "Henry", "date_of_birth": null }]
  }
}
```
The UI immediately reflects all updated fields in the right-hand panel in real time.

---

## 5. Edge Cases & Solutions

| Edge Case | Failure Risk | Lexora Engineering Solution |
| :--- | :--- | :--- |
| **Markdown wrapping in raw JSON** | `JSON.parse` crashes when LLMs wrap output with ` ```json ... ``` ` | Implemented automatic regex stripping in `parseResponse` to isolate valid JSON substrings. |
| **Conversational pleasantries** | LLM extracts small talk as field data | System prompt restricts extraction to predefined schema properties only. |
| **Uncertainty / Speculation** | User says *"I might want my brother to do it, but I'm not sure"* | Prompt directs model to treat non-affirmative intent as non-extraction and ask follow-up questions instead. |
| **API Rate Limits / Outages** | Application breaks mid-session | Caught in `GroqProvider.processMessage` with graceful fallback messages and zero data loss. |

---

## 6. Future AI Research & Optimization

1. **Structured Tool Calling / Function Calling**: Transitioning Groq calls to native `tools` schema definitions for guaranteed schema validation at the inference layer.
2. **Specialized Small Language Model (SLM)**: Fine-tuning a 7B parameter open-weight model (e.g., Llama 3.1 8B or Gemma 2 9B) specifically on legal intake dialogues for cost-free, on-premises deployment.
3. **Voice Intake Stream**: Integrating Groq's high-speed Whisper speech-to-text API for seamless hands-free dictation.
