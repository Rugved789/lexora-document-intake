# Lexora — Conversational Legal Directives & Intake Workbench

> **Reliable, AI-assisted document intake that transforms natural dialogue into verified, deterministic legal directives.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-teal.svg)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)](https://clerk.com/)
[![Groq LPU](https://img.shields.io/badge/LLM-Groq%20LPU-orange.svg)](https://groq.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717.svg)](https://github.com/Rugved789/lexora-document-intake)

---

🔗 **GitHub Repository**: [https://github.com/Rugved789/lexora-document-intake](https://github.com/Rugved789/lexora-document-intake)  
📡 **Production API Endpoint**: `http://localhost:3000` *(Configurable via `.env`)*

---

## 🎯 Executive Overview

**Lexora** is an AI-assisted legal directive workbench engineered to solve the friction and ambiguity of traditional estate planning and intake forms. People communicate personal intentions naturally through conversation, but legal documents demand rigid structure, strict accuracy, and zero assumptions.

Lexora resolves this tension through a strict engineering invariant:

> ### **Conversation History ≠ Structured State**
> 
> - **Conversation History**: An unstructured log of dialogue between the user and assistant.
> - **Structured State**: A deterministic, validated, versioned JSON schema representing confirmed legal facts.
> - **Draft Documents & PDFs**: Compiled strictly from the **Structured State**, never hallucinated by an LLM.

---

## ✨ Key Capabilities

### Conversational Intelligence
- 💬 **Natural Dialogue Intake**: Users express wishes naturally without needing to understand legal terminology.
- ⚡ **Multi-Field Extraction**: Extracts multiple facts (name, address, children, executor designations, gifts, residual wishes) from a single user turn.
- 🔍 **Contradiction Detection**: Identifies conflicting declarations (e.g., claiming no children after earlier naming dependants) and requests explicit clarification before altering state.
- ✏️ **Graceful Corrections**: Users can update earlier decisions (*"Actually, make Sarah my executor instead of David"*) without re-parsing chat logs.
- 🛡️ **Zero-Assumption Policy**: Never invents or assumes missing data; incomplete fields trigger targeted conversational follow-ups.

### Studio & Interface Experience
- 🎨 **Ink + Paper + Digital Precision Aesthetics**: Custom theme featuring Deep Ink (`#0F1419`), Warm Ivory Paper (`#FDFCFA`), Warm Gold (`#B8860B`), and Restrained Indigo (`#4C51BF`).
- 🪐 **Interactive 3D Floating Hero**: GPU-accelerated levitation document cards with live ambient lighting.
- 🔬 **Contradiction Audit Inspector**: Dual-pane audit tool demonstrating real-time contradiction detection and conflict diffing.
- 🏛️ **Executive Directives Vault (Dashboard)**: Real-time directive search, live metrics overview, and an interactive **"Name Your Document Session"** modal with quick preset suggestions.
- 🎛️ **3-Pane Real-Time Workbench**:
  1. **Conversation Panel**: Responsive chat stream with turn indicators and quick action chips.
  2. **Structured State Panel**: Live 7-section completion progress (`Personal Info`, `Scope`, `Descendants`, `Executor`, `Gifts`, `Wishes`, `Confirmation`).
  3. **Document Preview & Download**: Fullscreen interactive PDF viewer and one-click download.
- ⏱️ **State History & Version Control**: Full audit trail tracking incremental versions (`v1`, `v2`, `v3`...), diff timestamps, and clean human-readable state cards (no raw JSON code dumps).

### Executive PDF Generation & Single Source of Truth
- 📜 **Editorial Legal Document Template**: Vector-sharp, print-safe A4 PDF document generated server-side using PDFKit.
- 🖋️ **Classic Legal Typography**: Built-in PostScript serif typography (`Times-Bold`, `Times-Roman`, `Times-Italic`) for formal legal weight, paired with restrained graphite uppercase labels (`Helvetica-Bold`).
- 🏛️ **Institutional Letterhead**: Geometric Lexora monogram box, `LEXORA` wordmark, `LEGAL DIRECTIVES PLATFORM` sub-mark, bordered `INTAKE SPECIMEN DRAFT` badge, `PRIVILEGED & CONFIDENTIAL` sub-mark, and double hairline rule.
- 📋 **Declarant Dossier Summary**: Shaded header block with vertical gold accent bar displaying principal identification, multi-line residence, and intake record date.
- 🔢 **Numbered Sections (01–06)**: Distinct brass gold numerals (`01`–`06`), divider rules, two-column label/value alignments, and bulleted descendants lists.
- 🎁 **Styled Asset Gifts Table**: Tabular layout with header row, alternating row shading, and designated item/beneficiary columns.
- 💬 **Declarant Speech Blockquote**: Verbatim residual wishes styled in an indented card with a brass indicator bar and italic declarant quote.
- ⚖️ **Formal Statutory Notice**: Prominent amber disclaimer box isolating non-binding demonstration notices.
- 📄 **Dynamic Pagination & Running Footers**: Accurate `Page X of Y` footers, multi-page running headers (Page 2+), and zero orphan headers. Standard intakes render cleanly on **exactly 1 page**.
- 🔄 **Unified Endpoint**: Both the in-app modal preview and the downloaded PDF stream the exact same binary from `GET /api/intakes/:id/document`.

---

## 🏗️ Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (Browser)                      │
│        React 18 + Vite 5 + Tailwind CSS + Clerk SDK         │
│          "Ink + Paper + Digital Precision" Design           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Express)                   │
│   Node.js ES Modules • Clerk JWT Auth • Zod 3.23 Schemas    │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐┌──────────────────────────────┐
│     PostgreSQL Database     ││   Provider-Independent LLM   │
│   Prisma ORM 5.14 Client    ││  Groq API (openai/gpt-oss)   │
│  Sessions, Messages, State  ││  MockLLMProvider (Offline)   │
└─────────────────────────────┘└──────────────────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, `@clerk/clerk-react`, Axios, Lucide-style SVG icons |
| **Backend** | Node.js (ESM), Express 4.19, `@clerk/clerk-sdk-node`, CORS, Dotenv |
| **Data & ORM** | PostgreSQL 14+, Prisma ORM (`@prisma/client` 5.14) |
| **Validation** | Zod 3.23 (Runtime request and state schema validation) |
| **LLM Inference** | **Groq Cloud LPU** (`openai/gpt-oss-120b` or `llama-3.3-70b-versatile`) |
| **Test Harness** | `MockLLMProvider` (100% deterministic, zero-API rule-based test extractor) |

---

## 📁 Repository Structure

```
wenup_project/
├── client/                     # React 18 Frontend Application
│   ├── src/
│   │   ├── components/        # Navigation, Hero, ContradictionDemo, Panels, etc.
│   │   ├── pages/             # LandingPage, Dashboard, IntakeSession
│   │   ├── services/          # Centralized API client with Clerk token injection
│   │   ├── styles/            # design-tokens.css (Aesthetic tokens & animations)
│   │   └── main.jsx           # Client entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express Backend Application
│   ├── src/
│   │   ├── config/            # Centralized environment configuration
│   │   ├── controllers/       # intakeController (Sessions, messages, exports)
│   │   ├── middleware/        # Clerk auth validation & centralized error handler
│   │   ├── routes/            # REST API route declarations
│   │   ├── schemas/           # Zod validation schemas (API & state)
│   │   ├── services/
│   │   │   ├── document/      # Deterministic legal document generator
│   │   │   ├── intake/        # Intake session persistence logic
│   │   │   └── llm/           # GroqProvider, MockLLMProvider & factory
│   │   └── app.js             # Express application initialization
│   ├── prisma/                # Prisma schema & migrations
│   ├── tests/                 # Unit tests (MockLLM, state, document generation)
│   └── package.json
│
├── docs/                       # Complete System Documentation Hub
│   ├── README.md              # Documentation navigation hub
│   ├── ARCHITECTURE.md        # Full architecture specifications & diagrams
│   ├── arch.md                # Architecture quick reference mirror
│   ├── SETUP_AND_RUNNING.md   # Step-by-step setup and running instructions
│   ├── AI_LOG.md              # AI engineering, prompt design & contradiction log
│   └── PRODUCTION_IMPROVEMENTS.md # Enterprise production readiness roadmap
│
├── .env.example                # Environment configuration template
└── README.md                   # Project overview (this file)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0+`
- **PostgreSQL**: Running locally or via cloud (e.g. Neon, Supabase)
- **Clerk Account**: Free account at [clerk.com](https://clerk.com)
- **Groq API Key**: Free key at [console.groq.com](https://console.groq.com)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd wenup_project

# Install root, client, and server dependencies
npm install
cd client && npm install && cd ../server && npm install && cd ..
```

### 3. Environment Variables
Create a `.env` file in `server/` (and root):
```ini
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_yourClerkSecretKeyHere

# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wenup_intake?schema=public"

# LLM Provider Configuration
LLM_PROVIDER=groq
LLM_MODEL=openai/gpt-oss-120b
GROQ_API_KEY=gsk_yourGroqApiKeyHere
```

Create a `.env` file in `client/`:
```ini
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yourClerkPublishableKeyHere
VITE_API_URL=http://localhost:3000/api
```

### 4. Database Setup
```bash
cd server
npm run db:push
cd ..
```

### 5. Launch the Development Servers
From the root directory:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

*(For detailed step-by-step instructions, see [`docs/SETUP_AND_RUNNING.md`](./docs/SETUP_AND_RUNNING.md).)*

---

## 🧪 Automated Testing

Lexora includes 32 automated tests across 4 comprehensive test suites:
- 🤖 **`mockLLM.test.js`**: LLM extraction, multi-field capture, executor/children extraction, and contradiction handling.
- 📐 **`structuredState.test.js`**: Zod schema validation, delta merging, and correction overrides.
- 📑 **`documentGenerator.test.js`**: Completion status calculation, fallback handling, and deterministic text formatting.
- 📜 **`pdfGenerator.test.js`**: Vector PDF generation, empty state resilience, multi-page pagination, and asset tables.

```bash
cd server
npm test
```

To run individual test suites:
```bash
node --test tests/mockLLM.test.js
node --test tests/structuredState.test.js
node --test tests/documentGenerator.test.js
node --test tests/pdfGenerator.test.js
```

---

## 📡 REST API Reference

All protected routes require an `Authorization: Bearer <Clerk_Session_Token>` header.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Public server health check |
| `GET` | `/api/intakes` | List all directives for authenticated user |
| `POST` | `/api/intakes` | Create a new directive session with custom title |
| `GET` | `/api/intakes/:id` | Retrieve session, messages, state, and document |
| `DELETE` | `/api/intakes/:id` | Delete a directive session |
| `POST` | `/api/intakes/:id/messages` | Send conversational turn and trigger state extraction |
| `PATCH` | `/api/intakes/:id/state` | Update structured state directly |
| `GET` | `/api/intakes/:id/document` | Re-fetch compiled deterministic legal draft |
| `GET` | `/api/intakes/:id/history` | Retrieve full version history of state mutations |

---

## 📚 In-Depth Documentation

Detailed guides and specifications are maintained in the [`docs/`](./docs) directory:

- 🏛️ **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** (or [arch.md](./docs/arch.md)) — Comprehensive system architecture, state machine theory, and component hierarchies.
- 🚀 **[SETUP_AND_RUNNING.md](./docs/SETUP_AND_RUNNING.md)** — Complete step-by-step setup, configuration, and troubleshooting guide.
- 🧠 **[AI_LOG.md](./docs/AI_LOG.md)** — AI prompt engineering, Groq LPU benchmarks, contradiction detection heuristics, and zero-assumption invariants.
- 🛡️ **[PRODUCTION_IMPROVEMENTS.md](./docs/PRODUCTION_IMPROVEMENTS.md)** — Production readiness roadmap (Clerk Express SDK migration, rate limiting, PII encryption at rest, Redis caching, PDF exports, and telemetry).
- 📑 **[Documentation Hub](./docs/README.md)** — Overview index of all documentation files.

---

## ⚖️ Legal Disclaimer

Lexora is designed for demonstration and technological exploration of high-reliability conversational information extraction. Generated directives are drafts for informational purposes and **do not constitute legal advice**. Users should always consult a licensed estate planning attorney in their jurisdiction.

---

## 📄 License

MIT © [Lexora](https://github.com/)
