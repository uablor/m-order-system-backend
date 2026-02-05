# Test Suite — DDD + CQRS + NestJS

Tests live under `/test`. **PNPM** is used for all commands.

## Structure

| Folder | Purpose |
|--------|--------|
| `test/unit` | Domain (aggregates, value objects), application (handlers), shared (response, pagination, interceptors). **No DB.** |
| `test/integration` | Infrastructure (mappers, repository behavior). Pure conversion or test DB. |
| `test/e2e` | End-to-end: auth, order, payment, customer flows (see `*.e2e-spec.ts` at project root). |
| `test/fixtures` | Domain and test data builders (no ORM). |
| `test/mocks` | Mock implementations for repositories and external services only. **Never mock domain logic.** |
| `test/helpers` | E2E helpers (e.g. `createE2EApp`, `loginForE2E`, `authHeaders`). |

## Commands

```bash
pnpm test              # Unit + integration (jest)
pnpm test:watch        # Watch mode
pnpm test:cov          # With coverage
pnpm test:e2e          # E2E (jest --config ./test/jest-e2e.json)
```

## Rules (Code__Standards.md)

- **Domain tests:** Assert aggregate invariants, value object validation, domain events. No mocks in domain.
- **Application tests:** Mock only **repositories** (and external services). Never mock domain.
- **Infrastructure tests:** Mapper conversion, pagination helper; optional repository with test DB.
- **E2E:** Auth flow, order flow, payment flow, customer flow; use real app and test DB/env.
- **Response standard:** All APIs return `{ status, message, data, pagination?, error? }`; covered by `ResponseBuilder` and `GlobalResponseInterceptor` tests.

## Config

- **Unit/Integration:** `jest.config.js` (root) — `testRegex`: `test/(unit|integration)/.+\\.spec\\.ts$`, `rootDir`: `.`, `moduleNameMapper` for `@shared/*`.
- **E2E:** `test/jest-e2e.json` — `testRegex`: `.e2e-spec.ts$`, `testTimeout`: 30000.
