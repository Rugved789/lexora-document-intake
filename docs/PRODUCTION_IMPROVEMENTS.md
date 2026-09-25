# Lexora — Production Readiness & Improvement Roadmap

This document outlines key technical, security, and architectural enhancements recommended to transition Lexora from its current functional development version into an enterprise-grade, legally compliant production platform.

---

## 1. Authentication & SDK Modernization

### Migrate to `@clerk/express`
- **Current**: Server utilizes `@clerk/clerk-sdk-node`, which outputs an upstream deprecation notice.
- **Production Improvement**:
  - Replace with native `@clerk/express` middleware (`clerkMiddleware()`).
  - Retrieve authenticated context using `getAuth(req)`.
  - Enables seamless cookie and header session management with zero deprecation warnings.

### Role-Based Access Control (RBAC) & Attorney Workspaces
- Implement role tiers: `User` (directive owner), `Reviewer` (licensed attorney/fiduciary), and `Admin`.
- Allow users to invite estate attorneys to review their compiled structured state and legal draft in read-only or collaborative review mode.

---

## 2. Security & Compliance Hardening

### Rate Limiting & Abuse Prevention
- Implement tiered rate limiting using `express-rate-limit` and Redis:
  - **General API**: 120 requests / 15 minutes per IP.
  - **LLM Conversational Endpoints**: 30 turns / minute per authenticated user to prevent API quota exhaustion and denial-of-wallet attacks.

### Encryption of Sensitive Personal Information (PII) at Rest
- Legal directives store highly sensitive data (full legal names, family relationships, physical addresses, asset allocation wishes).
- **Production Improvement**: Encrypt `stateJson` and message text in PostgreSQL using AES-256-GCM before saving, using keys managed in AWS KMS, GCP Secret Manager, or HashiCorp Vault.

### Security Headers & Sanitization
- Add `helmet` middleware to enforce strict Content Security Policies (CSP), HSTS, and X-Frame-Options.
- Sanitize conversational strings against XSS injection attacks.

### Immutable Legal Audit Trail
- Log every state mutation with user ID, IP address, timestamp, field-level diff, and cryptographic hash to establish an indisputable chain of custody for legal records.

---

## 3. Scalability & Performance Engineering

### Database Connection Pooling
- Integrate **PgBouncer** or **Prisma Accelerate** to manage PostgreSQL connection spikes during peak traffic without exhausting database connection limits.

### High-Throughput Redis Caching Layer
- Cache active session states and conversation turn buffers in Redis.
- Avoid repetitive database round-trips for high-frequency interactive turns.

### Asynchronous Message Queue for Heavy Tasks
- Introduce a distributed queue (**BullMQ** or **Celery** with Redis) for tasks that take more than 1 second:
  - Generating print-ready PDF/DOCX files.
  - Vector embeddings and semantic document search.
  - Multi-jurisdictional compliance rule checks.

---

## 4. Document Compilation & Legal Export Engine

### High-Fidelity PDF & DOCX Generation
- Replace plain-text draft formatting with server-side PDF generation via `@react-pdf/renderer` or headless Puppeteer.
- Incorporate:
  - Professional legal document margins, running headers, and page numbering (*"Page X of Y"*).
  - Formal signature and witness acknowledgment blocks.
  - Cryptographic QR code and verification seal certifying document provenance against the Lexora state hash.

### E-Signature Integration
- Integrate with e-signature providers (DocuSign, Dropbox Sign) or electronic notary services to allow one-click execution of generated directives.

---

## 5. Observability, Monitoring & LLM Telemetry

### Structured Logging
- Replace `console.log` with structured JSON logging using **Pino** or **Winston**.
- Standardize log schemas with `traceId`, `userId`, `intakeSessionId`, and execution latency.

### LLM Performance & Cost Telemetry
- Integrate an LLM observability platform (such as **Langfuse** or **Helicone**):
  - Track p50, p95, and p99 inference latency across models.
  - Track token consumption, cost per intake session, and failure/retry rates.
  - Monitor prompt drift and model response consistency over time.

### Automated Alerting
- Set up alerts via Sentry or Datadog for:
  - Spike in 4xx/5xx API errors.
  - LLM provider timeouts or rate limits.
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
- GitHub Actions pipeline to run linting, schema validation, unit test suites, and Docker image builds on every pull request.
