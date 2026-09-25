# Lexora — Production Readiness & Improvement Roadmap

This document outlines key technical, security, and architectural enhancements recommended to transition Lexora from its current functional version into an enterprise-grade, legally compliant production platform.

---

## 1. Authentication & SDK Modernization

### Migrate to `@clerk/express`
- **Current State**: The backend utilizes `@clerk/clerk-sdk-node` (`clerkClient.verifyToken`), which prints an upstream deprecation notice recommending migration.
- **Production Implementation**:
  ```javascript
  import { clerkMiddleware, getAuth } from '@clerk/express';
  
  app.use(clerkMiddleware());
  
  export function requireAuth(req, res, next) {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    }
    req.userId = userId;
    next();
  }
  ```
- **Benefits**: Eliminates deprecation warnings, provides native Express middleware binding, and streamlines cookie/header session token extraction.

### Role-Based Access Control (RBAC) & Attorney Workspaces
- Implement role tiers:
  - `Declarant`: The directive creator and primary fact declarer.
  - `Reviewer / Attorney`: Licensed estate counsel invited to review compiled state in collaborative or read-only mode.
  - `Admin`: System operations and compliance auditor.
- Support tokenized collaboration links allowing attorneys to annotate fields or request specific clarifications.

---

## 2. Security & Compliance Hardening

### Tiered Rate Limiting & Abuse Prevention
- Protect external API quota and database resources using `express-rate-limit` with a Redis store:
  - **General API Endpoints**: 100 requests / 15 minutes per IP.
  - **LLM Conversational Endpoint (`POST /api/intakes/:id/messages`)**: 25 turns / minute per authenticated user to prevent quota exhaustion and denial-of-wallet vectors.
  - **Document Generation Endpoint (`GET /api/intakes/:id/document`)**: 10 downloads / minute to protect CPU resources.

### Encryption of Sensitive Personal Information (PII) at Rest
- Legal directives store highly sensitive data (full legal names, family relationships, physical addresses, asset allocation wishes).
- **Production Architecture**:
  - Implement column-level encryption in PostgreSQL for `stateJson` and message text using AES-256-GCM.
  - Encryption keys rotated via AWS KMS, GCP Cloud KMS, or HashiCorp Vault.
  - Server decrypts state only during authorized in-memory processing.

### HTTP Security Headers & Sanitization
- Incorporate `helmet` middleware to enforce strict headers:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
- Conversational strings sanitized against cross-site scripting (XSS).

### Immutable Legal Audit Trail
- Log every state mutation with user ID, IP address, timestamp, field-level diff, and cryptographic hash to establish an indisputable chain of custody for legal records.

---

## 3. Scalability & Performance Engineering

### Database Connection Pooling
- **Current State**: Prisma Client connects to PostgreSQL with startup pre-warming (`prisma.$connect()`).
- **Production Enhancement**: Utilize connection poolers (Neon Connection Pooler, PgBouncer, or Prisma Accelerate) to gracefully handle high concurrency without exhausting database connection limits.

### High-Throughput Redis Caching Layer
- Cache active session states and conversation turn buffers in Redis.
- Avoid repetitive database round-trips for high-frequency interactive turns.

### Asynchronous Background Message Queue
- Introduce a distributed queue (**BullMQ** with Redis) for compute-intensive tasks:
  - Generating high-resolution vector PDF and DOCX exports.
  - Asynchronous audit log persistence.
  - Outbound email notifications and webhooks.

---

## 4. Document Compilation & Legal Export Engine

### Completed Production Features (Live)
- [x] **Dedicated Server-Side PDFKit Engine**: Replaced plain-text exports with vector-sharp PDF generation running in <50ms without headless browser overhead.
- [x] **Classic Legal Typography**: PostScript serif hierarchy (`Times-Bold`, `Times-Roman`, `Times-Italic`) paired with uppercase graphite metadata labels (`Helvetica-Bold`).
- [x] **Institutional Letterhead & Monogram**: Deep navy monogram with gold accent hairline, spaced wordmark, and confidential specimen draft badges.
- [x] **Declarant Dossier Summary**: Shaded 3-column card with vertical brass indicator bar and wrapping address formatting.
- [x] **Numbered Sections (01–06)**: Distinct brass numerals, hairline divider rules, and two-column label/value alignments.
- [x] **Asset Gifts Table**: Structured tabular layout with header shading and designated beneficiary/item columns.
- [x] **Declarant Verbatim Blockquote**: Preserves declarant's exact voice in an indented parchment card with italic styling.
- [x] **Dynamic Pagination**: Two-pass page buffering generating accurate `Page X of Y` footers with zero orphan headers.
- [x] **Single Binary Endpoint**: Both the in-app fullscreen Preview and direct Download consume `GET /api/intakes/:id/document`.

### Next Enhancements: Cryptographic Verification & Formats
- **Cryptographic State Hash & QR Seal**: Embed a SHA-256 state seal and scannable QR verification badge directly in the document footer for instant authenticity verification.
- **DOCX / Word Export**: Support editable `.docx` exports using the `docx` npm library for attorney customization and localized filing.
- **E-Signature Integration**: Integrate DocuSign or Dropbox Sign API for one-click digital execution and notarization.

---

## 5. Observability, Telemetry & LLM Monitoring

### Structured JSON Logging
- Replace `console.log` with structured JSON logging using **Pino** or **Winston**.
- Standardize log schemas with `traceId`, `userId`, `intakeSessionId`, and execution latency.

### LLM Performance & Cost Telemetry
- Integrate an LLM observability platform (such as **Langfuse** or **Helicone**):
  - Track p50, p95, and p99 inference latency across models.
  - Track token consumption, cost per intake session, and failure/retry rates.
  - Monitor prompt drift and model response consistency over time.

### Automated Alerting
- Configure alerts via Sentry or Datadog for:
  - Spike in 4xx/5xx API errors.
  - LLM provider timeouts or rate limit exceptions.
  - Database pool saturation.

---

## 6. Testing & CI/CD Pipelines

### End-to-End (E2E) Test Suite
- Implement **Playwright** browser tests to validate full user journeys:
  - Sign in via Clerk test environment.
  - Create new directive through the session title modal.
  - Complete 5-turn conversational intake.
  - Verify live state updates, contradiction resolution, and document export.

### Synthetic LLM Regression Benchmarks
- Maintain a suite of 50+ benchmark conversational transcripts (containing edge cases, typos, and contradictions).
- Automatically evaluate extraction accuracy and zero-assumption adherence before deploying new system prompts.

### Automated CI/CD
- GitHub Actions pipeline to run linting, schema validation, unit test suites (32 unit tests), and Docker image builds on every pull request.
