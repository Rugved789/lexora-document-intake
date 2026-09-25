# Lexora — Setup & Running Instructions

This guide provides end-to-end instructions for installing, configuring, running, and testing the Lexora application across local development and cloud environments.

---

## 1. System Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **PostgreSQL**: `v14.0` or higher (running locally or via a cloud database like Neon, Supabase, or Railway)
- **Clerk Account**: Free account at [clerk.com](https://clerk.com) for authentication.
- **Groq API Key**: Free key at [console.groq.com](https://console.groq.com) for high-speed cloud LLM inference.
- **Git**

---

## 2. Repository Architecture Overview

Lexora is structured as an npm monorepo workspace containing separate frontend and backend applications:

```
wenup_project/
├── client/              # React 18 + Vite + Tailwind CSS frontend
├── server/              # Express + Prisma + LLM backend
├── docs/                # Architecture, setup, and AI documentation
├── package.json         # Root workspace scripts (concurrently)
└── .gitignore           # Git ignore definitions
```

---

## 3. Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Rugved789/lexora-document-intake.git
cd lexora-document-intake
```

### Step 2: Install Dependencies
Install dependencies across the root, client, and server:

```bash
# Install root orchestration packages
npm install

# Install client dependencies
npm install --workspace=client

# Install server dependencies
npm install --workspace=server
```

> [!TIP]
> Alternatively, you can run `npm install` from within each directory: `npm install && cd client && npm install && cd ../server && npm install && cd ..`.

---

## 4. Environment Variables Configuration

The application requires specific environment variables for both the server and client.

### Server Configuration (`server/.env`)
Create a `.env` file in the `server/` directory:

```ini
# Server Network Settings
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Clerk Authentication (Server Secret Key)
CLERK_SECRET_KEY=sk_test_yourClerkSecretKeyHere

# PostgreSQL Database Connection URL (Neon Cloud or Local)
# Format: postgresql://[user]:[password]@[host]:[port]/[database_name]?sslmode=require
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wenup_intake?schema=public"

# LLM Provider Configuration
# Supported providers: "groq" (default cloud production) or "mock" (offline test harness)
LLM_PROVIDER=groq
LLM_MODEL=openai/gpt-oss-120b
GROQ_API_KEY=gsk_yourGroqApiKeyHere
```

> [!NOTE]
> `CLIENT_URL` can accept multiple comma-separated origins (e.g. `http://localhost:5173,https://your-app.vercel.app`). The server also automatically permits requests originating from `.vercel.app` domains.

### Client Configuration (`client/.env` or `client/.env.local`)
Create a `.env` or `.env.local` file in the `client/` directory:

```ini
# Clerk Publishable Key (Safe for browser exposure)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yourClerkPublishableKeyHere

# Backend API Endpoint
# Local development:
VITE_API_URL=http://localhost:3000/api
# Or production deployment:
# VITE_API_URL=https://lexora-document-intake-server.vercel.app/api
```

---

## 5. Third-Party Service Setup

### A. Clerk Authentication Setup
1. Log in to [Clerk Dashboard](https://dashboard.clerk.com/) and click **Add application**.
2. Name your application (e.g., `Lexora Workspace`).
3. Select your desired sign-in options (Email, Google, GitHub, etc.).
4. Under **API Keys**, copy:
   - **Publishable Key** (`pk_test_...`) → Paste into `client/.env` as `VITE_CLERK_PUBLISHABLE_KEY`.
   - **Secret Key** (`sk_test_...`) → Paste into `server/.env` as `CLERK_SECRET_KEY`.
5. Under **Paths / URLs**, configure:
   - Allowed redirect origin: `http://localhost:5173`

### B. Groq API Setup
1. Log in to [Groq Console](https://console.groq.com/).
2. Navigate to **API Keys** and click **Create API Key**.
3. Copy the key (`gsk_...`) and paste into `server/.env` as `GROQ_API_KEY`.
4. *Tip*: If you do not have an active Groq key, set `LLM_PROVIDER=mock` in `server/.env` to run in completely offline mode using the deterministic rule-based extractor.

### C. PostgreSQL Database (Neon Cloud or Local)
- **Cloud (Recommended)**: Create a free database instance on [Neon](https://neon.tech), copy the connection string, and paste it into `server/.env` as `DATABASE_URL`. Neon provides instant connection pooling and SSL encryption out of the box.
- **Local**: Ensure PostgreSQL 14+ is running locally on port `5432` with a database named `wenup_intake`.

---

## 6. Database Initialization & Migrations

Lexora uses PostgreSQL with Prisma ORM.

### Step 1: Generate Prisma Client Types
```bash
cd server
npm run db:generate
```

### Step 2: Push Database Schema
Apply the schema directly to your PostgreSQL database:
```bash
npm run db:push
```

### Step 3: (Optional) Inspect Database with Prisma Studio
To inspect tables and records visually:
```bash
npm run db:studio
```
Prisma Studio opens at `http://localhost:5555`.

---

## 7. Running the Application

### Option A: Concurrently from Root (Recommended)
From the project root:
```bash
npm run dev
```
This boots both the client (`http://localhost:5173`) and server (`http://localhost:3000`) simultaneously using `concurrently`.

### Option B: Running in Separate Terminals

#### Terminal 1 — Backend Server:
```bash
cd server
npm run dev
```
*Output*:
```
Server running on port 3000
Environment: development
LLM Provider: groq
✓ PostgreSQL Database connection pre-warmed successfully
```

#### Terminal 2 — Frontend Client:
```bash
cd client
npm run dev
```
*Output*:
```
  VITE v5.2.11  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 8. Verifying the System

1. **Health Check**:
   Open `http://localhost:3000/health` in your browser. It should return:
   ```json
   { "status": "ok", "timestamp": "2026-09-26T01:00:00.000Z" }
   ```

2. **Access Landing Page**:
   Visit `http://localhost:5173`. You should see the Lexora landing page with floating 3D legal document cards, the interactive contradiction audit inspector, and demonstration panels.

3. **Authenticate & Enter Workspace**:
   - Click **Enter Workspace** or **Sign In**.
   - Complete Clerk authentication.
   - You will land on the **Executive Vault Dashboard** (`/app`).

4. **Create a Directive**:
   - Click **+ New Document Session**.
   - Enter a title (e.g. *"Personal Wishes Directive - 2026"*) or select a preset suggestion.
   - The interactive 3-pane workbench (`/app/intake/:id`) will open.

5. **Test Dialogue Extraction**:
   - Type: *"My name is Eleanor Vance, and I reside at 45 Beacon Street, Boston, MA."*
   - Observe the live update in the **Structured State Panel** and the **Legal Document Preview**.

6. **Preview & Download PDF**:
   - Click **Preview Specimen** to view the rendered vector PDF in the fullscreen viewer.
   - Click **Download Formal PDF** to test binary streaming from `GET /api/intakes/:id/document?download=true`.

---

## 9. Running Automated Test Suites

The backend includes 32 automated unit tests across 4 comprehensive test suites:
- 🤖 **`mockLLM.test.js`**: LLM information extraction, multi-field capture, executor/children extraction, and contradiction handling.
- 📐 **`structuredState.test.js`**: Zod schema validation, delta merging, and correction overrides.
- 📑 **`documentGenerator.test.js`**: Completion status calculation, fallback handling, and deterministic text formatting.
- 📜 **`pdfGenerator.test.js`**: Vector PDF generation, empty state resilience, multi-page pagination, and asset tables.

To run all tests:
```bash
cd server
npm test
```

To run individual test suites:
```bash
cd server
node --test tests/mockLLM.test.js
node --test tests/structuredState.test.js
node --test tests/documentGenerator.test.js
node --test tests/pdfGenerator.test.js
```

All 32 tests execute in ~1 second using Node.js's native test runner with zero external API calls.

---

## 10. Common Troubleshooting & FAQs

### Q1: `Missing required environment variables: CLERK_SECRET_KEY, DATABASE_URL`
- **Cause**: The server `.env` file is missing or located in the wrong directory.
- **Fix**: Ensure `server/.env` exists and contains valid `CLERK_SECRET_KEY` and `DATABASE_URL` strings.

### Q2: `Clerk Node SDK notice period warning`
- **Cause**: `@clerk/clerk-sdk-node` prints an upstream deprecation notice recommending migration to `@clerk/express`.
- **Status**: Harmless notice. The server functions normally. See [Production Improvements](./PRODUCTION_IMPROVEMENTS.md) for the migration plan.

### Q3: `Groq rate limit exceeded (429)` or `Invalid Groq API Key (401)`
- **Fix**: Verify your `GROQ_API_KEY` at [console.groq.com](https://console.groq.com). Alternatively, switch `LLM_PROVIDER=mock` in `server/.env` to run with the offline rule-based test extractor.

### Q4: CORS Error when making requests from Client to Server
- **Fix**: Verify that `CLIENT_URL` in `server/.env` matches your frontend origin (default: `http://localhost:5173`). For cloud deployments, verify that the domain ends in `.vercel.app` or is explicitly added to `CLIENT_URL`.

### Q5: Database Connection Timeouts on Cold Starts
- **Fix**: The backend automatically pre-warms the Prisma database pool on boot via `prisma.$connect()`. On the client, `api.js` includes an Axios interceptor that automatically retries transient cold-start errors after a 700ms delay.
