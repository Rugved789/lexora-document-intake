# Lexora — Setup & Running Instructions

This guide provides end-to-end instructions for installing, configuring, running, and testing the Lexora application across development and staging environments.

---

## 1. System Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **PostgreSQL**: `v14.0` or higher (running locally or a cloud database like Neon / Supabase / Railway)
- **Clerk Account**: Free account at [clerk.com](https://clerk.com) for authentication.
- **Groq API Key**: Free key at [console.groq.com](https://console.groq.com) for high-speed LLM inference.
- **Git**

---

## 2. Repository Architecture Overview

Lexora is structured as a monorepo workspace containing separate frontend and backend applications:

```
wenup_project/
├── client/              # React 18 + Vite frontend
├── server/              # Express + Prisma + LLM backend
├── docs/                # Architecture, setup, and AI documentation
├── package.json         # Root workspace scripts
└── .env.example         # Root configuration template
```

---

## 3. Step-by-Step Installation

### Step 1: Clone and Navigate to Project
```bash
git clone <repository-url>
cd wenup_project
```

### Step 2: Install Dependencies
Install dependencies across the root, client, and server:

```bash
# Install root orchestration packages
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

---

## 4. Environment Variables Configuration

The application requires specific environment variables for both the server and client.

### Server Configuration (`server/.env` or root `.env`)
Create a `.env` file in the `server/` directory (or use root `.env`):

```ini
# Server Network Settings
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Clerk Authentication (Server Secret Key)
CLERK_SECRET_KEY=sk_test_yourClerkSecretKeyHere

# PostgreSQL Database Connection URL
# Format: postgresql://[user]:[password]@[host]:[port]/[database_name]?schema=public
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wenup_intake?schema=public"

# LLM Provider Configuration
# Supported providers: "groq" (default production) or "mock" (offline test harness)
LLM_PROVIDER=groq
LLM_MODEL=openai/gpt-oss-120b
GROQ_API_KEY=gsk_yourGroqApiKeyHere
```

### Client Configuration (`client/.env`)
Create a `.env` file in the `client/` directory:

```ini
# Clerk Publishable Key (Safe for browser exposure)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yourClerkPublishableKeyHere

# Backend API Endpoint
VITE_API_URL=http://localhost:3000/api
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

---

## 6. Database Initialization & Migrations

Lexora uses PostgreSQL with Prisma ORM.

### Step 1: Ensure PostgreSQL is Running
Verify PostgreSQL is active on your machine:
```bash
# On Windows (PowerShell):
Get-Service postgresql*

# Or check connection using psql:
psql -U postgres -h localhost -p 5432
```

### Step 2: Create Database
If the database `wenup_intake` does not exist:
```bash
# Via PostgreSQL CLI:
createdb -U postgres wenup_intake
```

### Step 3: Synchronize Schema & Generate Client
Navigate to `server/` and apply the Prisma schema:
```bash
cd server

# Generate Prisma Client types
npm run db:generate

# Push database schema directly to PostgreSQL
npm run db:push
```

### Step 4: (Optional) Inspect Database with Prisma Studio
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
This boots both client (`http://localhost:5173`) and server (`http://localhost:3000`) simultaneously using `concurrently`.

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
```

#### Terminal 2 — Frontend Client:
```bash
cd client
npm run dev
```
*Output*:
```
  VITE v5.4.21  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 8. Verifying the System

1. **Health Check**:
   Open `http://localhost:3000/health` in your browser. It should return:
   ```json
   { "status": "ok", "timestamp": "2026-09-25T11:45:00.000Z" }
   ```

2. **Access Landing Page**:
   Visit `http://localhost:5173`. You should see the Lexora landing page with floating 3D legal document cards and interactive demonstration panels.

3. **Authenticate & Enter Workspace**:
   - Click **Enter Workspace** or **Sign In**.
   - Complete Clerk authentication.
   - You will land on the **Lexora Workspace Vault** (`/app`).

4. **Create a Directive**:
   - Click **+ New Document Session**.
   - Type a title (e.g. *"Personal Wishes Directive - 2026"*) or click a suggestion chip.
   - The interactive 3-pane workbench (`/app/intake/:id`) will open.

5. **Test Dialogue Extraction**:
   - Type: *"My name is Eleanor Vance, and I reside at 45 Beacon Street, Boston, MA."*
   - Observe the live update in the **Structured State Panel** and the **Legal Document Preview**.

---

## 9. Running Automated Test Suites

The backend includes test suites covering schema validation, state merging, document generation, and MockLLM extraction.

```bash
cd server
npm test
```

To run a specific test suite:
```bash
# Test Document Generator:
node --test tests/documentGenerator.test.js

# Test Structured State Validation:
node --test tests/structuredState.test.js
```

---

## 10. Common Troubleshooting & FAQs

### Q1: `Missing required environment variables: CLERK_SECRET_KEY, DATABASE_URL`
- **Cause**: The server `.env` file is missing or not located where the server process was initiated.
- **Fix**: Ensure `server/.env` exists and contains non-empty `CLERK_SECRET_KEY` and `DATABASE_URL` strings.

### Q2: `Clerk Node SDK notice period warning`
- **Cause**: `@clerk/clerk-sdk-node` prints an upstream deprecation notice encouraging migration to `@clerk/express`.
- **Status**: Harmless notice. The server functions normally. See [Production Improvements](./PRODUCTION_IMPROVEMENTS.md) for the migration plan.

### Q3: `Groq rate limit exceeded (429)` or `Invalid Groq API Key (401)`
- **Fix**: Check that `GROQ_API_KEY` is valid at [console.groq.com](https://console.groq.com). Alternatively, switch `LLM_PROVIDER=mock` in `.env` to work without an API key.

### Q4: CORS Error when making requests from Client to Server
- **Fix**: Verify that `CLIENT_URL` in `server/.env` exactly matches your frontend port (default: `http://localhost:5173`).
