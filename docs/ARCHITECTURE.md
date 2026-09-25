# Lexora — System Architecture Documentation

## 1. Executive Summary

**Lexora** is an AI-assisted conversational document intake workbench designed for high-assurance legal directives, personal declarations, and estate planning. Traditional legal intake workflows force users into rigid, intimidating web forms where nuance, natural context, and edge cases are lost. Lexora replaces static forms with a fluid, guided dialogue interface while maintaining a **deterministic, structured state** as the single source of truth.

---

## 2. Core Architectural Principles

```
┌──────────────────────────────────────────────────────────┐
│                   Conversational Stream                  │
│  User: "My name is Eleanor Vance, living in Boston."     │
│  Assistant: "Recorded, Eleanor. Do you have children?"   │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Extraction & Validation
┌──────────────────────────────────────────────────────────┐
│              Deterministic Structured State              │
│  {                                                       │
│    "full_name": "Eleanor Vance",                         │
│    "home_address": "Boston, MA",                         │
│    "has_children": null                                  │
│  }                                                       │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼ Deterministic PDF Engine
┌──────────────────────────────────────────────────────────┐
│          Executive Vector Legal Directive (PDF)          │
│  "I, Eleanor Vance, residing at Boston, MA, declare..."  │
└──────────────────────────────────────────────────────────┘
```

### Principle A: Conversation History ≠ Structured State
This is the foundational invariant of the Lexora system:
- **Conversation History** records chronological messages exchanged between the user and the assistant.
- **Structured State** is a validated, typed, versioned JSON schema representing confirmed legal facts.

**Why this separation is essential:**
1. **Frictionless Corrections**: If a user states *"Actually, my brother Marcus will be my executor instead of Robert"*, the engine updates `state.executor` directly without needing to redact or re-parse prior chat history.
2. **Deterministic Contradiction Detection**: Conflicting statements are detected by comparing incoming declarations against the current structured state, rather than searching unstructured message logs.
3. **Verifiable Document Compilation**: Final legal documents and PDFs are generated exclusively from verified structured state keys, eliminating LLM hallucination in final drafts.
4. **Immutable State Versioning**: Every state mutation is tagged with an incremental version counter (`v1`, `v2`, `v3`...) for auditability.

### Principle B: Zero-Assumption Policy
The extraction engine operates under strict zero-assumption constraints:
- If a user omits information, the state remains `null` or `undefined`.
- The engine never guesses marital status, addresses, or familial relations.
- Incomplete states trigger targeted conversational clarification prompts.

### Principle C: State Diffs (Delta Updates) vs Full Replacement
Rather than having the LLM re-emit the entire state on every turn (which risks dropping previously extracted fields during context compression), the provider returns **only the delta updates**:
```json
{
  "stateUpdates": {
    "executor": {
      "name": "Marcus Vance",
      "relationship": "Brother"
    }
  }
}
```
The backend state service merges these deltas through schema validation guards, preserving all existing confirmed facts.

---

## 3. Technology Stack & Component Architecture

```
                    ┌───────────────────────────┐
                    │      Client (Browser)     │
                    │   React 18 + Vite + Tailwind│
                    │   Clerk React SDK (Auth)  │
                    └─────────────┬─────────────┘
                                  │ HTTPS / REST (Axios Interceptors)
                                  ▼
                    ┌───────────────────────────┐
                    │   API Gateway (Express)   │
                    │   Port 3000 / JSON Parser │
                    │   Clerk Token Verification│
                    └──────┬─────────────┬──────┘
                           │             │
              ┌────────────┘             └────────────┐
              ▼                                       ▼
┌───────────────────────────┐           ┌───────────────────────────┐
│     PostgreSQL Database   │           │   LLM Inference Engine    │
│  Neon Cloud / Local       │           │  Groq API (LPU Hardware)  │
│  Prisma ORM 5.14 Client   │           │  Model: gpt-oss-120b      │
│  Pre-warmed Pooler        │           │  (Test Harness: MockLLM)  │
└───────────────────────────┘           └───────────────────────────┘
```

### Frontend Architecture (`/client`)
- **Framework**: React 18 with Vite 5.
- **Design System**: Custom tokens adhering to the *"Ink + Paper + Digital Precision"* aesthetic:
  - Deep Ink (`#0F1419`), Warm Ivory Paper (`#FDFCFA`), Warm Gold/Brass (`#B8860B`), Restrained Indigo (`#4C51BF`).
  - Typography: `Plus Jakarta Sans` (interface), `Lora` (editorial/documents), `JetBrains Mono` (technical metrics).
- **Core Views**:
  - **Landing Page**: 3D floating document hero with GPU levitation, interactive contradiction audit inspector, dual-panel conversation-to-structure workbench, process timeline, and legal document preview.
  - **Dashboard (Executive Vault)**: Real-time directive search, live metrics counter, session creation dialog with preset suggestions, and chronological cards with `DIR-01` tags.
  - **Intake Session**: 3-pane responsive workbench combining live chat (`ConversationPanel`), real-time field progress (`StructuredStatePanel`), interactive legal draft preview (`DocumentPreview`), and version history inspector (`StateHistoryViewer`).
- **Resilience**: Axios response interceptor automatically handles transient cold starts with exponential backoff.
- **Authentication**: Clerk React SDK (`@clerk/clerk-react`) with protected routes and auto-injected JWT bearer tokens.

### Backend Architecture (`/server`)
- **Runtime**: Node.js (ES Modules: `"type": "module"`).
- **Framework**: Express 4.19 with CORS supporting localhost and `.vercel.app` domains, JSON body parser, and centralized error handling.
- **Startup Pre-Warming**: Pre-warms PostgreSQL connection via `prisma.$connect()` upon server boot.
- **Validation**: Zod 3.23 for strict runtime validation across API requests and LLM extraction payloads.
- **Database**: PostgreSQL 14+ (Neon Cloud or local) managed via Prisma ORM (`@prisma/client` 5.14).
- **Authentication**: Clerk Node SDK (`@clerk/clerk-sdk-node`), validating JWTs against `CLERK_SECRET_KEY` and extracting `req.userId`.

---

## 4. Provider-Independent LLM Engine

All LLM operations are decoupled through the `LLMProvider` abstract contract:

```javascript
export class LLMProvider {
  async processMessage(request) {
    // request: { currentState, conversation, latestUserMessage }
    // return: { assistantMessage, stateUpdates, clarificationRequired, ... }
    throw new Error('processMessage must be implemented by subclass');
  }
}
```

```
server/src/services/llm/
├── LLMProvider.js         # Base abstract contract
├── GroqProvider.js        # Production implementation (Groq SDK / LPU inference)
├── MockLLMProvider.js     # Deterministic mock provider for tests & offline dev
└── index.js               # Dynamic provider factory
```

### 1. `GroqProvider` (Production Default)
- Uses Groq's high-speed LPU (Language Processing Unit) hardware.
- Model: `openai/gpt-oss-120b` (or `llama-3.3-70b-versatile`).
- Generates structured JSON responses conforming to schema parameters.
- Built-in graceful fallback: If an API error (rate limits, timeouts) occurs, the user receives an informative message while preserving state integrity.

### 2. `MockLLMProvider` (Test & Offline Harness)
- Purely deterministic, rule-based extraction engine.
- Extracts names, addresses, children arrays, specific gifts, negative declarations, and executor designations using regex patterns.
- Runs without internet access or API credentials.
- Powers automated unit test suites in `server/tests/`.

---

## 5. Database Schema & Data Models

Managed via Prisma in `server/prisma/schema.prisma`:

```prisma
model IntakeSession {
  id          String   @id @default(cuid())
  clerkUserId String
  title       String   @default("New Intake")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  messages         ConversationMessage[]
  structuredStates StructuredState[]

  @@index([clerkUserId])
  @@map("intake_sessions")
}

model ConversationMessage {
  id              String   @id @default(cuid())
  intakeSessionId String
  role            String   // "user" or "assistant"
  content         String   @db.Text
  createdAt       DateTime @default(now())

  intakeSession IntakeSession @relation(fields: [intakeSessionId], references: [id], onDelete: Cascade)

  @@index([intakeSessionId])
  @@map("conversation_messages")
}

model StructuredState {
  id              String   @id @default(cuid())
  intakeSessionId String   @unique
  stateJson       String   @db.Text
  version         Int      @default(1)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  intakeSession IntakeSession @relation(fields: [intakeSessionId], references: [id], onDelete: Cascade)

  @@index([intakeSessionId])
  @@map("structured_states")
}
```

---

## 6. End-to-End Request & Extraction Lifecycle

```
[User types message in Client]
           │
           ▼
[Client: api.sendMessage(id, text) with Bearer JWT]
           │
           ▼
[Express Server: requireAuth middleware verifies JWT claims via Clerk]
           │
           ▼
[intakeController: Fetch existing IntakeSession, Messages, & Current State]
           │
           ▼
[LLMProvider.processMessage({ currentState, conversation, latestUserMessage })]
           │
           ▼
[LLM extracts stateUpdates, checks contradictions, returns JSON]
           │
           ▼
[Zod Schema Validation & State Merge (mergeStateUpdates)]
           │
           ▼
[Prisma: Save user message, assistant response, & increment StructuredState version]
           │
           ▼
[documentGenerator: Recompile deterministic draft document]
           │
           ▼
[HTTP 200 Response: Return updated messages, state, completion metrics, and draft]
```

---

## 7. REST API Endpoints

All application routes are prefixed with `/api` and require a valid Bearer JWT:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check and timestamp | No |
| `POST` | `/api/intakes` | Create a new intake session with initial empty state | Yes |
| `GET` | `/api/intakes` | List all intake sessions owned by the authenticated user | Yes |
| `GET` | `/api/intakes/:id` | Fetch full intake session details, messages, and state | Yes |
| `DELETE` | `/api/intakes/:id` | Delete an intake session and cascading records | Yes |
| `POST` | `/api/intakes/:id/messages` | Send user message, trigger extraction, update state | Yes |
| `PATCH` | `/api/intakes/:id/state` | Manually update specific structured state fields | Yes |
| `GET` | `/api/intakes/:id/document` | Stream compiled PDF binary (`?download=true` / `?format=json`) | Yes |
| `GET` | `/api/intakes/:id/history` | Retrieve version history audits for structured state | Yes |

---

## 8. Professional PDF Generation & Preview Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Deterministic Structured State              │
│  { full_name, home_address, executor, children, ... }    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│       Document Service & PDF Generator (PDFKit)          │
│  - A4 Geometry & Legal-Tech Design System                │
│  - Multi-Page Flow & Dynamic Page Numbering ("Page X/Y") │
│  - Fictional Notice & Structured Table Formatting        │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼ application/pdf Binary Stream
┌──────────────────────────────────────────────────────────┐
│           Single Document Endpoint (GET /document)       │
└────────────────────────────┬─────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Document Preview      │ │     Document Download     │
│  - Fullscreen Modal       │ │  - Direct PDF Save        │
│  - Real PDF Viewer        │ │  - Content-Disposition    │
│  - Blob URL Object        │ │  - Exact Same Binary      │
└───────────────────────────┘ └───────────────────────────┘
```

### Technical Decision: Server-Side PDFKit vs. Headless Chromium
To guarantee 100% reliability across all target cloud environments (Render, Vercel, Railway, AWS Lambda, Docker), the platform uses **PDFKit** rather than headless browser solutions (Puppeteer/Playwright):
1. **Zero System Dependencies**: Headless Chromium requires ~400MB of native Linux dependencies (`libnss3`, `libatk`, `libcups`) that frequently break or fail to launch in lean containerized or serverless hosting tiers.
2. **Sub-50ms Generation Latency**: PDFKit generates vector-sharp, standards-compliant PDF documents in under 50ms without the memory overhead of spawning an external browser process.
3. **Deterministic Pagination**: Precise A4 dimensions (595.28 x 841.89 pt) and a two-pass `bufferedPageRange` ensure page counts (`Page X of Y`), running headers, and legal disclaimers are calculated dynamically and placed cleanly.
4. **Single Source of Truth**: Both the fullscreen in-app Preview and direct Download consume the exact same `application/pdf` binary stream emitted by `GET /api/intakes/:id/document`.

### Executive Document Template & Styling Specifications
The PDF generator adheres to an executive, editorial legal document styling system:
- **Typography**: Dual-typeface legal hierarchy pairing PostScript serif (`Times-Bold`, `Times-Roman`, `Times-Italic`) for formal legal content with restrained sans-serif (`Helvetica-Bold`, `6.5pt`–`7pt`, `#64748B`) for metadata labels.
- **Institutional Letterhead**: Deep navy square monogram with serif `L`, spaced `LEXORA` wordmark, `LEGAL DIRECTIVES PLATFORM` sub-mark, bordered `INTAKE SPECIMEN DRAFT` classification badge, `PRIVILEGED & CONFIDENTIAL` sub-mark, and double hairline rule.
- **Declarant Dossier Card**: 3-column shaded block (`#F8FAFC`) with vertical brass gold indicator bar (`#B8860B`) accommodating natural multi-line address wrapping without string truncation.
- **Numbered Sections (01–06)**: Distinct brass numerals (`01`–`06`) separated by vertical dividers and hairline rules extending to the right margin.
- **Two-Column Grid Alignment**: Standardized two-column alignment across Personal Info (01), Territorial Scope (02), Descendants (03), and Fiduciary Appointment (04).
- **Descendants List (03)**: Indented vertical list with brass bullet markers (`•`), bold names, and italic `— Primary Descendant` descriptors.
- **Asset Gifts Table (05)**: Header row (`ITEM #`, `DESIGNATED BENEFICIARY`, `ALLOCATED ASSET / BEQUEST`), subtle background fill (`#F1F5F9`), and alternating row shading.
- **Residual Directives (06)**: Indented parchment card (`#FAF9F6`) with vertical brass gold bar and `Times-Italic` quoted text representing declarant's verbatim words.
- **Statutory Notice Box**: Amber disclaimer box (`#FFFDF7` fill, `#FDE68A` border, `#D97706` indicator bar) setting apart non-binding demonstration notices.
- **Orphan Header Prevention**: Height budget checks (`neededHeight = 50–65pt`) ensure section headers and their contents stay together across page breaks.
- **Running Headers & Footers**: Running header on Page 2+ (`● LEXORA Personal Wishes Declaration • Specimen Draft CONFIDENTIAL`) and running footers on every page with right-aligned `Page X of Y`. Standard single-declarant documents render cleanly on **exactly 1 page**.

---

## 9. Security Architecture

1. **Zero-Trust Client Identity**: The server never trusts client-supplied user identifiers. The `userId` is extracted strictly from verified Clerk cryptographic JWT claims (`sessionClaims.sub`).
2. **Session Ownership Enforcement**: Every database query verifies that `intakeSession.clerkUserId === req.userId`. Users cannot access or modify directives belonging to other accounts.
3. **Environment Isolation**: API secrets (`CLERK_SECRET_KEY`, `GROQ_API_KEY`, `DATABASE_URL`) are isolated to backend environment variables and never exposed to the frontend bundle.
4. **Input Sanitization & Schema Guards**: All user inputs are parsed via Zod before hitting service layers or database queries.

---

## 10. Related Documentation

- [Setup & Running Guide](./SETUP_AND_RUNNING.md)
- [AI Engineering & Development Log](./AI_LOG.md)
- [Production Readiness Roadmap](./PRODUCTION_IMPROVEMENTS.md)
- [Documentation Hub](./README.md)
