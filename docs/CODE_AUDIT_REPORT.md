# Code Audit Report – M-Order System Backend

**Date:** 2025-01-30  
**Scope:** Full codebase – DDD, Clean Architecture, duplicates, performance, security, structure.

---

## ✅ Clean & Correct

- **Domain layer:** No `@nestjs`, `typeorm`, `class-validator`, or `class-transformer` imports in any `**/domain/**` files. Domain depends only on shared kernel (BaseEntity, ValueObject, Result).
- **Controllers:** All controllers delegate to use cases; no business logic in presentation layer.
- **Application layer:** Use cases only; commands/queries are well separated.
- **Infrastructure:** ORM entities, repository implementations, and mappers are in the correct layer. Mappers (ORM ↔ Domain) exist for Customer, Order, Notification, Payment, Arrival, ExchangeRate.
- **Shared kernel:** `BaseEntity`, `ValueObject`, `Result`, `GlobalExceptionFilter`, pagination types, enums, UUID util, and exceptions are used consistently.
- **Auth:** JWT guards and role decorators applied on protected routes; `@Public()` on login/register/refresh.
- **Module structure:** All modules follow `domain/`, `application/`, `infrastructure/`, `presentation/` where applicable (Customer, Order, Notification, Payment, Arrival, ExchangeRate, Identity, Auth).
- **Testing:** Use cases and repositories are injectable; no static business logic in controllers.

---

## ❌ Problems Found

### 1. Presentation logic in controllers (DDD / Clean Architecture)

| File | Problem | Fix |
|------|---------|-----|
| `arrival/presentation/controllers/arrival.controller.ts` | DTOs (`RecordArrivalItemDto`, `RecordArrivalDto`) and `toResponse()` defined inside controller. | Move DTOs to `arrival/application/dto/`; move `toResponse` to `arrival/application/mappers/arrival-response.mapper.ts`. |
| `payment/presentation/controllers/payment.controller.ts` | Inline `toResponse()` duplicates `PaymentResponseDto` contract. | Add `payment/application/mappers/payment-response.mapper.ts` and use it in the controller. |
| `identity/presentation/controllers/user.controller.ts` | Inline `toResponse()` for user. | Add `identity/application/mappers/user-response.mapper.ts` and use it in the controller. |
| `exchange-rate/presentation/controllers/exchange-rate.controller.ts` | DTO `CreateRateDto` and inline response mapping in controller. | Move DTO to `exchange-rate/application/dto/`; add response mapper or DTO and use shared date util. |

### 2. Duplicate code – Pagination

| Location | Problem | Fix |
|----------|---------|-----|
| `shared/pagination/paginate.ts` | `PaginateDto` and `getSkipTake` duplicate `pagination.dto.ts`. | Remove `paginate.ts`; keep single source in `pagination.dto.ts`. |
| `shared/pagination/paginated-response.ts` | `PaginatedResponse` and `createPaginatedResponse` duplicate `paginated-result.ts`. | Remove `paginated-response.ts`; keep `PaginatedResult` and `createPaginatedResult` in `paginated-result.ts`. |

### 3. Duplicate code – Date formatting

| File | Problem | Fix |
|------|---------|-----|
| `arrival.controller.ts` (line 78) | `arrivedDate instanceof Date ? a.arrivedDate.toISOString().slice(0, 10) : a.arrivedDate` | Use shared `formatDateOnly()`. |
| `payment.controller.ts` (line 37) | Same pattern for `paymentDate`. | Use shared `formatDateOnly()`. |
| `exchange-rate.controller.ts` (lines 69, 102) | `entity.rateDate.toISOString().slice(0, 10)`. | Use shared `formatDateOnly()`. |
| `order/application/mappers/order-response.mapper.ts` (line 78) | Same for `orderDate`. | Use shared `formatDateOnly()`. |

### 4. Inconsistent merchant context (security / multi-tenant)

| File | Problem | Fix |
|------|---------|-----|
| `customer.controller.ts` | Correctly reads `merchantId` from JWT via `getMerchantId(req)`. | Keep; extract `getMerchantIdFromRequest(req)` to shared helper for reuse. |
| `order.controller.ts`, `payment.controller.ts`, `arrival.controller.ts`, `notification.controller.ts`, `exchange-rate.controller.ts` | Accept `merchantId` from query/body only. Any authenticated user could pass another merchant’s ID. | Validate that `merchantId` from request equals JWT `merchantId`, or derive merchant from JWT only (recommended for tenant isolation). |

### 5. Dead / redundant exports

| File | Problem | Fix |
|------|---------|-----|
| `shared/pagination/index.ts` | Exports both `PaginateDto`/`createPaginatedResponse` and `PaginationDto`/`createPaginatedResult`. | Export only one DTO and one result type after consolidation. |

---

## 🔁 Duplicate Code Summary

| Duplicate | Where | Proposed shared abstraction |
|-----------|--------|-----------------------------|
| Pagination DTO + getSkipTake | `paginate.ts`, `pagination.dto.ts` | Single `PaginationDto` and `getSkipTake` in `pagination.dto.ts`. |
| Paginated result type + factory | `paginated-response.ts`, `paginated-result.ts` | Single `PaginatedResult` and `createPaginatedResult` in `paginated-result.ts`. |
| Date-only string (YYYY-MM-DD) | Arrival, Payment, ExchangeRate controllers; order-response.mapper | `shared/utils/date.util.ts`: `formatDateOnly(value: Date \| string): string`. |
| getMerchantId from Request | Only in customer.controller | `shared/helpers/request-merchant.helper.ts`: `getMerchantIdFromRequest(req, TokenPayload)` (or similar). |

---

## ⚠️ Performance Notes

| Area | Status | Notes |
|------|--------|-------|
| Customer list | OK | Uses QueryBuilder with `skip`/`take` and `getManyAndCount()`; single query. |
| Order list | OK | Pagination and filters; no N+1 in list. |
| Order save with items | OK | Uses transaction; loop over items is acceptable for typical batch sizes. Consider batch insert if item count grows large. |
| Payment / Arrival by order | OK | Queries by order ID; no N+1 reported. |
| Indexes | Not audited in code | Ensure DB indexes on `merchant_id`, `domain_id`, `order_id`, `created_at` where used in filters. |

---

## 🛡 Security

| Issue | Location | Fix |
|-------|----------|-----|
| Merchant ID from query | Order, Payment, Arrival, Notification, ExchangeRate | Validate `merchantId` against JWT `merchantId` (or use JWT only) for tenant isolation. |
| Sensitive fields | Auth responses | Ensure tokens and passwords are not logged or exposed in responses (current usage appears correct). |

---

## 🔧 Refactor Summary

1. **Pagination:** Use only `PaginationDto`, `getSkipTake`, `PaginatedResult`, and `createPaginatedResult`. Remove `paginate.ts` and `paginated-response.ts`; update `shared/pagination/index.ts`.
2. **Date util:** Add `shared/utils/date.util.ts` with `formatDateOnly()`. Use it in Arrival, Payment, ExchangeRate, and order-response mapper.
3. **Payment:** Add `payment/application/mappers/payment-response.mapper.ts` mapping domain/entity to `PaymentResponseDto`; use in payment controller.
4. **Arrival:** Add `arrival/application/dto/record-arrival.dto.ts` and `arrival-response.dto.ts`; add `arrival/application/mappers/arrival-response.mapper.ts`; remove inline DTOs and `toResponse` from controller.
5. **Identity:** Add `identity/application/mappers/user-response.mapper.ts`; use in user controller.
6. **Exchange-rate:** Move `CreateRateDto` to `exchange-rate/application/dto/`; use `formatDateOnly()` for response; optionally add response DTO/mapper.
7. **Shared helper:** Add `shared/helpers/request-merchant.helper.ts` with `getMerchantIdFromRequest(req)`; use in customer controller and document for other modules to enforce tenant isolation.

---

## 📋 Final Checklist (after refactor)

| Area | Status |
|------|--------|
| DDD compliance | ✅ Controllers use application DTOs and mappers only; no inline DTOs/toResponse. |
| Duplicate code removed | ✅ Pagination consolidated; date util added; response mappers used everywhere. |
| Performance optimized | ✅ No critical N+1; pagination in place. |
| Clean code | ✅ Shared helpers (getMerchantIdFromRequest, formatDateOnly); single pagination API. |
| Security | ⚠️ Customer uses JWT merchantId via getMerchantIdFromRequest; other modules still accept merchantId from query—recommend validating against JWT for tenant isolation. |
| Testability | ✅ DI and use-case-based design; mappers are pure functions. |

---

## Files to Create/Modify

### Create

- `src/shared/utils/date.util.ts`
- `src/shared/helpers/request-merchant.helper.ts`
- `src/shared/helpers/index.ts`
- `src/modules/payment/application/mappers/payment-response.mapper.ts`
- `src/modules/arrival/application/dto/record-arrival.dto.ts`
- `src/modules/arrival/application/dto/arrival-response.dto.ts`
- `src/modules/arrival/application/dto/index.ts`
- `src/modules/arrival/application/mappers/arrival-response.mapper.ts`
- `src/modules/identity/application/mappers/user-response.mapper.ts`
- `src/modules/exchange-rate/application/dto/create-rate.dto.ts` (optional, for consistency)

### Modify

- `src/shared/pagination/index.ts` – export only one DTO and one result type.
- Remove or repurpose `src/shared/pagination/paginate.ts` and `src/shared/pagination/paginated-response.ts`.
- `src/modules/payment/presentation/controllers/payment.controller.ts` – use payment-response.mapper.
- `src/modules/arrival/presentation/controllers/arrival.controller.ts` – use application DTOs and arrival-response.mapper.
- `src/modules/identity/presentation/controllers/user.controller.ts` – use user-response.mapper.
- `src/modules/exchange-rate/presentation/controllers/exchange-rate.controller.ts` – use date util (and optional DTO/mapper).
- `src/modules/customer/presentation/controllers/customer.controller.ts` – use shared getMerchantIdFromRequest.
- `src/modules/order/application/mappers/order-response.mapper.ts` – use formatDateOnly().
- `src/shared/index.ts` – export helpers if added.
