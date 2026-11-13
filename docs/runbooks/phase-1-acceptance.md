# Phase 1 acceptance gates

**Phase 1 status:** ON HOLD.  
**Production deployment** requires separate, explicit **project-owner authorization**. Completing this checklist is **not** authorization to deploy.

Terminology matches [security-operations.md](./security-operations.md): **development**, **staging**, **production**.  
Rollback procedures: [rollback.md](./rollback.md).

### Status labels

| Label | Meaning |
|-------|---------|
| **Currently implemented** | Covered by automated tests and/or code on `phase-1/security-remediation` (re-verify before release) |
| **Proposed** | Acceptance criterion still needs an automated regression test and/or implementation hardening |
| **Ops / manual** | Gate verified by procedure, build, or owner sign-off — not solely by unit tests |

---

## Acceptance checklist with regression mapping

Every security criterion has at least one corresponding automated regression test ID. Where coverage is incomplete today, the test is marked **Proposed** and must be added before release.

| Gate | Regression test(s) | Coverage status |
|------|--------------------|-----------------|
| Automatic **production** admin creation eliminated | `SEC-T04` — default admin not created in production-like runtime | **Proposed** (extend suite beyond current smoke/RBAC checks) |
| Known public demo credentials cannot authenticate in **production** | `SEC-T05` — `isBlockedDemoCredential` / login rejection | **Currently implemented** (`tests/security/rbac-and-demo.test.ts`) |
| Secure **production** administrator provisioning documented | Docs review + `SEC-T04` / provision path policy | **Ops / manual** + docs in [security-operations.md](./security-operations.md) §1 (interactive entry — **Required target**) |
| **production** requires valid authentication secrets | `SEC-T01`, `SEC-T03` — `assertProductionEnv` / missing or weak `NEXTAUTH_SECRET` | **Currently implemented** (`tests/security/secrets.test.ts`); align code with **≥ 32 cryptographically random bytes** before release if needed |
| **production** requires database connection | `SEC-T02` — missing `DATABASE_URL` | **Currently implemented** (`tests/security/secrets.test.ts`) |
| Database failures never trigger silent memory writes | `SEC-T06` — memory store disabled when DB required / production | **Currently implemented** (partial — `allowMemoryStore` guards); **Proposed** repository integration test that mocks Prisma failure and asserts no memory write |
| Role mapping is explicit and deny-by-default | `SEC-T07` — unknown / narrow roles never map to admin | **Currently implemented** (`tests/security/rbac-and-demo.test.ts`) |
| API authorization enforced (session + documented API key scope) | `SEC-T08` customer blocked from admin APIs; `SEC-T09` staff permissions; `SEC-T16` API key accept/revoke | `SEC-T09` matrix checks **Currently implemented**; `SEC-T08` / `SEC-T16` **Proposed** API-level tests |
| **production** responses never expose OTP codes | `SEC-T10` — `allowDevSecretLeakage` false in production | **Currently implemented** (`tests/security/tokens-and-rate-limit.test.ts`); **Proposed** HTTP assertion on register/forgot-password handlers |
| Carrier webhook signatures verified (HMAC-SHA256, timestamp, replay) | `SEC-T13` invalid/missing signature; `SEC-T13b` timestamp skew; `SEC-T13c` replay | Partial shared-secret reject tests **Currently implemented**; HMAC/timestamp/replay tests **Proposed** — see [security-operations.md](./security-operations.md) §5 |
| Stripe webhook signatures verified | `SEC-T14` — invalid / missing signature in production | **Currently implemented** (`tests/security/webhooks.test.ts`) |
| Duplicate webhook processing prevented | `SEC-T15` — duplicate event id is no-op | **Proposed** (Stripe + carrier idempotency cases) |
| Security-sensitive tokens use cryptographically secure randomness | `SEC-T12` — crypto/hash contracts; no `Math.random` in auth-token path | **Currently implemented** (hash/CSPRNG-related); **Proposed** static/unit assert on `lib/auth-tokens` generators |
| API key documentation matches actual implementation | `SEC-T16` + OpenAPI review | **Ops / manual** + **Proposed** automated OpenAPI/security scheme check |
| Automated security regression tests pass (`npm run test`) | Full Vitest suite | **Ops / manual** gate |
| TypeScript typecheck passes (`npm run typecheck`) | CI / local command | **Ops / manual** gate |
| Production build succeeds (`npm run build`) | CI / local command with appropriate secrets | **Ops / manual** gate |
| Security documentation is complete | This file + [security-operations.md](./security-operations.md) + [rollback.md](./rollback.md) | **Ops / manual** gate |
| Rollback procedure has been reviewed | [rollback.md](./rollback.md) owner review | **Ops / manual** gate |
| Project owner approves the release | Explicit written authorization | **Ops / manual** — **required** before **production** deploy |

---

## Commands (non-production credentials only)

```bash
npm run test
npm run test:security
npm run typecheck
npm run build
```

---

## Administrator provisioning (acceptance reference)

Provisioning must follow the **interactive / one-time** procedure in [security-operations.md](./security-operations.md) §1.  
Do **not** accept CLI `--password` examples or `SEED_ADMIN_PASSWORD=...` shell exports as the approved production procedure.

---

## Webhook acceptance reference

- **Stripe:** raw-body signature verification + event idempotency ([security-operations.md](./security-operations.md) §5).  
- **Carrier:** HMAC-SHA256 over raw body, timestamp validation, replay prevention, and idempotency — **Required target** before production ([security-operations.md](./security-operations.md) §5).

---

## Deployment hold

Phase 1 remains **ON HOLD** until:

1. All **Proposed** tests above are implemented and green, and  
2. The project owner issues **separate explicit authorization** for **staging** and/or **production** deployment.

See [rollback.md](./rollback.md) before any release or revert.
