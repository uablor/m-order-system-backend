# E2E Tests

E2E specs are at project root: `test/*.e2e-spec.ts` (auth, order, payment, customer, etc.).

Run:

```bash
pnpm test:e2e
```

Requires:

- `.env` with `DB_*` and optionally `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, `TEST_MERCHANT_ID` for login.
- Database migrations applied (`pnpm db:migration:run`).

Flows covered:

- **Auth:** POST /auth/login, /auth/register, /auth/refresh (validation, 401, 200 + tokens).
- **Order:** POST/GET /orders (401 without token, 400 invalid body, 201 create, 200 list).
- **Payment:** Create and list payments (guards, validation).
- **Customer:** Customer endpoints (guards, validation).

See `test/helpers/e2e-helpers.ts` for `createE2EApp`, `loginForE2E`, `authHeaders`, `cleanTables`.
