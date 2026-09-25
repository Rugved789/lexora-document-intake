# Lexora — AI Engineering & Development Log

This document records the architectural decisions, prompt engineering iterations, contradiction detection mechanisms, and resilience strategies governing Lexora's conversational legal intake engine.

---

## 1. Executive AI Mission

The central mission of Lexora's AI layer is:
> **Convert natural, nuanced human dialogue into legally sound, deterministic structured state without ever assuming, inventing, or losing facts.**

In legal and fiduciary document preparation, standard conversational chatbot behavior (creative extrapolation, guessing missing details, unprompted embellishment) creates severe legal liability. Lexora enforces a strict **Zero-Assumption Contract**:
- Every legal fact must originate from explicit user declaration.
- Missing attributes remain `null` until affirmed.
- Ambiguities trigger focused clarification prompts rather than inferred defaults.

---

## 2. Model Selection & Inference Architecture

Lexora's AI layer is engineered around cloud-native, high-throughput Language Processing Units (LPUs) combined with an offline deterministic test harness.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          LLM Service Factory                             │
│                     (server/src/services/llm/index.js)                   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
  ┌─────────────────────────────┐         ┌─────────────────────────────┐
  │        GroqProvider         │         │       MockLLMProvider       │
  │   Primary Cloud Inference   │         │    Deterministic Test Suite │
  │   Groq LPU Hardware         │         │    Rule-based regex engine  │
  │   openai/gpt-oss-120b       │         │    Zero network egress      │
  │   llama-3.3-70b-versatile   │         │    Runs in 150ms for CI     │
  └─────────────────────────────┘         └─────────────────────────────┘
```

### Primary Cloud Engine: Groq LPU Cloud Inference
- **Provider**: **Groq Cloud API** utilizing specialized LPU (Language Processing Unit) architecture.
- **Default Model**: `openai/gpt-oss-120b` (configurable to `llama-3.3-70b-versatile` via `LLM_MODEL`).
- **Engineering Rationale**:
  - **Inference Velocity**: 400–750 tokens/second delivers response turnarounds in ~350–450ms, rendering real-time document drafting completely seamless.
  - **Strict JSON Mode**: The Groq API enforces structured JSON output (`response_format: { type: 'json_object' }`), eliminating unstructured conversational runaway.
  - **Zero Temperature Drift**: Tuned to `temperature: 0.3` and `top_p: 0.9` for consistent, reproducible extraction across identical inputs.

### Deterministic Test Harness: `MockLLMProvider`
- **Requirement**: Automated unit tests and continuous integration pipelines must never depend on external API keys, rate quotas, or variable latency.
- **Solution**: A custom `MockLLMProvider` utilizing regular expressions, token analyzers, and state diff generators.
- **Outcome**: 100% offline testing capability; the full test suite (32 tests across 4 suites) runs in ~1 second with zero external API consumption.

### Decoupled Factory Pattern
All interaction flows through the abstract `LLMProvider` interface in `server/src/services/llm/LLMProvider.js`. The active provider is resolved at runtime via `server/src/services/llm/index.js` according to `LLM_PROVIDER`:
- `groq`: Production cloud LPU inference.
- `mock`: Offline development and test automation.

---

## 3. System Prompt Engineering

The system prompt is dynamically assembled in `GroqProvider.js` and injects the **current structured state** as context into every turn.

### Prompt Template & Directives:
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

**Available Fields:**
- full_name: string
- home_address: string
- covers_worldwide_assets: boolean
- has_children: boolean
- children: array of {name: string}
- executor: {name: string, relationship: string}
- has_specific_gifts: boolean (true if user has gifts, false if user has NO specific gifts or says "no gifts" / "none")
- specific_gifts: array of {item: string, recipient: string}
- additional_wishes: string (user wish text, or "None" if user states "no wishes" / "none" / "no additional wishes")

**Rules:**
1. Only update fields that the user explicitly mentions
2. If information contradicts existing state, set clarificationRequired: true
3. Never invent names, addresses, or relationships
4. If ambiguous (e.g., "he should be executor"), ask for clarification
5. Acknowledge what was provided, then ask for next missing field
6. Keep responses conversational and friendly
7. Extract multiple pieces of information from a single message when possible
8. Handle "no gifts" explicitly: If user states "no gifts", "no specific gifts", "don't have any gifts", or "none" for gifts, set "has_specific_gifts": false and "specific_gifts": []
9. Handle "no additional wishes" explicitly: If user states "no wishes", "no additional wishes", or "none" for wishes, set "additional_wishes": "None"
10. Handle combined negative declaration: If user states "no gifts and wishes" or "no gifts or wishes", set BOTH "has_specific_gifts": false, "specific_gifts": [] AND "additional_wishes": "None"
```

---

## 4. Key AI Engineering Invariants

### 1. Delta-Based State Updates (Diffs vs. Cumulative Snapshots)
- **Anti-Pattern**: Asking the model to return the entire cumulative state on each turn. Long conversations cause context compression, leading the model to drop previously declared fields.
- **Lexora Pattern**: The model outputs only `stateUpdates` representing fields newly provided or modified in the current turn.
- **Backend Merger**: `mergeStateUpdates` in `server/src/schemas/structuredState.js` safely incorporates the delta into the verified state, passing all mutations through Zod schema validation.

### 2. Contradiction Detection Algorithm
When incoming user intent conflicts with confirmed facts, the engine flags a contradiction rather than blindly overwriting the state:

```
User Message: "Actually, I don't have any children."
                    │
                    ▼
Current State Check: { has_children: true, children: [{ name: "Alice" }, { name: "Bob" }] }
                    │
                    ▼ Conflict Flagged!
{
  "assistantMessage": "Earlier you mentioned having two children, Alice and Bob. Could you clarify whether you'd like to update your records to reflect having no children?",
  "stateUpdates": {},
  "clarificationRequired": true,
  "clarificationReason": "User previously declared children (Alice, Bob) but now states they have no children.",
  "fieldsNeedingClarification": ["has_children", "children"],
  "confidence": "medium"
}
```

Because `clarificationRequired` is `true`, the backend **preserves existing state intact** and the client UI displays an alert badge until the user explicitly resolves the ambiguity.

### 3. Multi-Field Extraction in a Single Turn
Users frequently provide dense, compound answers:
> *"My name is Eleanor Vance, I live at 45 Beacon Street in Boston, and I have one son named Henry."*

The model captures all three dimensions in a single step:
```json
{
  "stateUpdates": {
    "full_name": "Eleanor Vance",
    "home_address": "45 Beacon Street, Boston",
    "has_children": true,
    "children": [{ "name": "Henry" }]
  }
}
```

### 4. Specific Asset Gifts & Bequest Arrays
Compound asset distributions are parsed into structured gift arrays:
> *"I want to give my Toyota Camry to Aarav and my vintage watch to Marcus."*

```json
{
  "stateUpdates": {
    "has_specific_gifts": true,
    "specific_gifts": [
      { "item": "Toyota Camry", "recipient": "Aarav" },
      { "item": "vintage watch", "recipient": "Marcus" }
    ]
  }
}
```
In the backend state merger, newly declared arrays replace previous partial declarations to prevent duplicate entries across conversational turns.

### 5. Explicit Negative Declarations
Users often explicitly opt out of gifts or residual clauses:
> *"I have no specific gifts and no additional wishes."*

The model triggers specialized extraction rules (Rules 8–10):
```json
{
  "stateUpdates": {
    "has_specific_gifts": false,
    "specific_gifts": [],
    "additional_wishes": "None"
  }
}
```
This cleanly completes the directive's progress checklist without forcing artificial inputs.

### 6. Verbatim Declarant Directives
When users dictate custom testamentary instructions:
> *"All family photographs should remain with my daughter and be preserved digitally."*

The engine preserves the declarant's exact phrasing in `additional_wishes` without editorial paraphrasing. In the compiled vector PDF, this text is set in an indented parchment card with `Times-Italic` typesetting to highlight the declarant's authentic voice.

---

## 5. Edge Cases & Resilience Matrix

| Edge Case | Risk | Lexora Engineering Solution |
| :--- | :--- | :--- |
| **Markdown Backtick Wrapping** | Model formats JSON inside ` ```json ... ``` ` blocks, breaking `JSON.parse` | `parseResponse` applies regex stripping to isolate the raw JSON payload before parsing. |
| **Conversational Pleasantries** | Small talk ("Good morning", "Thanks") misclassified as names or addresses | System prompt explicitly scopes extraction to defined schema properties; unmapped conversation remains in `assistantMessage`. |
| **Ambiguity & Speculation** | User says *"I might want my brother to do it, but I'm not sure"* | Prompt instructs the model to treat non-affirmative intent as non-extraction and follow up with a clarifying question. |
| **API Rate Limits / Outages** | External cloud provider returns `429` or network timeout | Caught in `GroqProvider.processMessage` with graceful fallback messages, zero data loss, and client auto-retry interceptors. |
| **Correction Overwrites** | User changes mind ("Actually, make Sarah my executor instead of David") | Delta merger overwrites `executor.name` and `executor.relationship` directly without requiring chat log rewrites. |

---

## 6. Future AI Research & Enterprise Roadmap

1. **Native Groq Tool / Function Calling**: Transitioning prompt-based JSON modes to native Groq `tools` schema definitions for hardware-enforced schema conformity.
2. **Multi-Agent Legal Verification**: Implementing a secondary legal validation agent that cross-checks completed directives against state/jurisdiction-specific probate codes.
3. **Voice Intake Dictation**: Integrating Groq's high-throughput Whisper API for ultra-low latency, hands-free conversational document intake.
4. **Automated Synthetic Regression Testing**: Expanding the offline test harness with 50+ benchmark transcripts evaluating prompt resilience against subtle contradictions and typo variations.
