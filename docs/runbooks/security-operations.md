# NECO Ship Global — Security operations runbook

**Phase 1 status:** ON HOLD — documentation and branch work only.  
**Production deployment** requires separate, explicit **project-owner authorization**. This runbook is not a deploy approval.

**Environments** (use these terms consistently):

| Term | Meaning |
|------|---------|
| **development** | Local workstation |
| **staging** | Non-production hosted environment with production-like controls |
| **production** | Live customer-facing deployment |

Never paste real passwords, tokens, or API secrets into tickets, chat, or documentation.

### Document status legend

| Label | Meaning |
|-------|---------|
| **Currently implemented** | Present on branch `phase-1/security-remediation` (verify before relying on it) |
| **Required target** | Phase 1 acceptance requirement; implement or harden before release |
| **Proposed** | Documented procedure or test not yet fully implemented as described |

Related documents: [phase-1-acceptance.md](./phase-1-acceptance.md) · [rollback.md](./rollback.md)

---

## 1. Secure administrator provisioning

### Policy

- Default administrator accounts must **not** be created at application boot or during login.
- Known legacy demo identities and passwords must be rejected in **production**.
- Administrator passwords must never appear in command-line arguments, shell history, CI logs, or committed environment files.

### Approved provisioning procedure (**Required target**)

Use a **one-time interactive** provisioning session against the target database. Do **not** pass the password on the command line or via exported shell variables.

**Recommended interactive pattern:**

```bash
# Requires DATABASE_URL in the process environment (from a secure secret store / .env.local that is gitignored).
# Password is entered interactively and never appears in argv.
npx tsx scripts/provision-admin.ts --email you@necoshipglobal.com --name "Ops Admin"
# When prompted: enter a strong unique password (stdin, hidden input).
```

**Approved alternatives** (same security bar):

1. Interactive CLI that reads the password from a TTY with echo disabled (`readline` / `read -s` equivalent).
2. One-time secret from an approved secret manager (for example Vercel / cloud secret) injected only for a single interactive session, then rotated — never stored in repo.
3. First-admin bootstrap gated to **development** / **staging** only, with forced password change before **production** use.

### Currently implemented vs required

| Item | Status |
|------|--------|
| Runtime auto-seed of default admin/demo users removed on Phase 1 branch | **Currently implemented** (verify) |
| `scripts/provision-admin.ts` exists | **Currently implemented** |
| Script still accepts `--password` / `SEED_ADMIN_*` in some code paths | **Deprecated** — do not use; treat as **Required target** to make interactive-only before production release |
| Rejection of known demo passwords during provision | **Currently implemented** / keep |

After any credential incident: rotate the administrator password using the interactive procedure above, then rotate `NEXTAUTH_SECRET` (see §3).

---

## 2. Production environment configuration

### Required in **production**

| Variable | Requirement |
|----------|-------------|
| `DATABASE_URL` | Managed PostgreSQL connection string |
| `DIRECT_URL` | Direct (non-pooled) URL when a pooler is used |
| `NEXTAUTH_SECRET` | At least **32 cryptographically random bytes** (for example 64 hex characters or 44-character base64). Never use `dev-nextauth-secret` or any short/predictable string |
| `NEXTAUTH_URL` | Canonical public site URL |

Generate an acceptable secret example (local machine only; do not commit the output):

```bash
openssl rand -base64 32
# or
openssl rand -hex 32
```

### Required before enabling related features in **production**

| Variable | Feature |
|----------|---------|
| `RESEND_API_KEY` / `EMAIL_FROM` | Email verification and password reset |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Card payments and signed Stripe webhooks |
| `CARRIER_WEBHOOK_SECRET` | Carrier tracking webhooks (HMAC key — see §5) |
| ShipEngine, Mapbox, Twilio, R2, Pusher keys | Optional integrations |

**Currently implemented:** production startup validation via `instrumentation.ts` → `assertProductionEnv()` when `DATABASE_URL` / strong `NEXTAUTH_SECRET` are missing (verify on Phase 1 branch). Character-length checks in code must be aligned with the **32 cryptographically random bytes** requirement before release (**Required target** if code still checks “32 characters” only).

---

## 3. Authentication secret rotation

1. Generate a new `NEXTAUTH_SECRET` with **≥ 32 cryptographically random bytes**.
2. Store it in the host secret store (Vercel Production / Preview as appropriate).
3. Redeploy **only** after project-owner authorization for that environment.
4. All existing JWT sessions become invalid; users must sign in again.
5. Confirm customer and administrator login with a provisioned administrator.

Do not roll back to a previously leaked secret. See [rollback.md](./rollback.md) Scenario B.

---

## 4. Database availability and recovery

| Rule | Status |
|------|--------|
| **production** never uses silent in-process memory fallback for operational data | **Required target** / verify **Currently implemented** fail-closed paths |
| DB unavailable → controlled **503** responses | **Required target** / verify |
| Restore via managed backup / PITR | Ops procedure |
| Do not “fix” outages by enabling production memory mode | Policy |

Detailed recovery steps: [rollback.md](./rollback.md) Scenario C.

---

## 5. Webhook configuration

### Stripe

| Item | Detail |
|------|--------|
| Endpoint | `POST /api/webhooks/stripe` |
| Verification | Provider signature over the **raw** request body (`Stripe-Signature`) |
| Secrets | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (test vs live separated) |
| Idempotency | Duplicate Stripe event IDs must not re-apply financial side effects |
| Status | Signature verification and duplicate handling: **Currently implemented** on Phase 1 branch (verify); keep sandbox/live separation |

### Carrier webhooks (**Required target**)

| Item | Detail |
|------|--------|
| Endpoint | `POST /api/webhooks/carriers` |
| Signature algorithm | **HMAC-SHA256** over the **raw request body** |
| Headers (proposed canonical) | `X-Neco-Signature: sha256=<hex>` (or equivalent documented name) and `X-Neco-Timestamp: <unix-seconds>` |
| Timestamp validation | Reject requests whose timestamp is outside an allowed skew (recommended ±5 minutes) |
| Replay prevention | Reject reused `(timestamp, signature, body)` combinations within the validity window |
| Idempotency | Persist provider `eventId` (or hash of body + timestamp); acknowledge duplicates without re-applying shipment side effects |
| Secret | `CARRIER_WEBHOOK_SECRET` — high-entropy key material, never logged |

**Currently implemented (verify):** production may reject missing `CARRIER_WEBHOOK_SECRET` and compare a shared header/Bearer value. That shared-secret header check is **not** sufficient for Phase 1 acceptance.

**Required target before production release:** replace shared-secret-only checks with HMAC-SHA256 over the raw body, timestamp validation, replay prevention, and idempotent event handling as specified above. Until then, treat carrier webhooks as **not production-ready**.

Invalid signatures → **401/400**. Missing production webhook configuration → do not accept unsigned events.

---

## 6. API key provisioning and revocation

| Item | Status |
|------|--------|
| Create via authenticated `POST /api/api-keys` (secret shown once) | **Currently implemented** (memory/DB paths — verify) |
| Store SHA-256 `keyHash` only | **Currently implemented** |
| Revoke via `DELETE /api/api-keys?id=…` | **Currently implemented** |
| `X-API-Key` on `/api/shipments` (GET/POST) as customer-scoped machine auth | **Currently implemented** on Phase 1 branch |
| API keys never grant administrator privileges | Policy / **Required target** to keep enforced |
| OpenAPI matches behavior | **Required target** — keep docs aligned |

---

## 7. Security incident response

1. Rotate `NEXTAUTH_SECRET` and affected integration secrets (Stripe, carrier HMAC key, etc.).
2. Reset compromised administrator passwords using **interactive** provisioning (§1).
3. Revoke suspicious API keys.
4. Suspend affected webhooks in the provider console if forged events are suspected.
5. Preserve logs **without** secret values.
6. Complete [phase-1-acceptance.md](./phase-1-acceptance.md) gates before reopening.
7. Follow [rollback.md](./rollback.md) for the matching scenario.

---

## 8. Automated testing

```bash
npm run test          # Vitest security regression suite
npm run test:security # Lightweight smoke script
npm run typecheck
npm run build         # only with appropriate non-production secrets for the target env
```

Never point tests at **production** databases or live payment/carrier credentials.

Every acceptance criterion must map to at least one automated regression test — see the matrix in [phase-1-acceptance.md](./phase-1-acceptance.md). Gaps marked **Proposed** must be filled before Phase 1 release.

---

## 9. Deployment verification

1. Deploy to **staging** only after the relevant owner authorization for staging.
2. Confirm: no demo login; customer denied admin; unsigned/invalid webhooks rejected; no OTP fields in production-mode API responses; HMAC carrier checks (when implemented).
3. **Production** deploy only after **separate, explicit project-owner authorization**.
4. Smoke authentication, database connectivity, and webhook rejection paths.
5. Owner sign-off against [phase-1-acceptance.md](./phase-1-acceptance.md).

---

## 10. Rollback

See [rollback.md](./rollback.md).

Never restore published demo passwords, `dev-nextauth-secret`, unsigned **production** webhooks, or silent memory fallback as a “fix.”
