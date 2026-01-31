# Swagger & API Test Coverage Audit Report

**Date:** 2025-01-30  
**Project:** Merchant Order Management System (NestJS)

---

## 1. Swagger Configuration (main.ts)

| Item | Status | Notes |
|------|--------|--------|
| Swagger enabled | ✅ | DocumentBuilder + SwaggerModule.setup |
| Swagger path | ✅ | Set to `api-docs` (was `api/docs`) |
| JWT BearerAuth | ✅ | addBearerAuth('BearerAuth') configured |
| X-Request-Id | ✅ | addApiKey documented |

---

## 2. Module Coverage Summary

### ✅ Swagger Implemented (complete)

| Module | Controller | Endpoints | ApiTags | ApiOperation | ApiResponse | ApiBearerAuth | DTOs ApiProperty |
|--------|------------|-----------|---------|--------------|-------------|---------------|------------------|
| App | AppController | GET / | ✅ App | ✅ | ✅ 200, 429 | N/A (public) | N/A |
| Customer | CustomerController | POST /customers, GET /customers, GET /customers/:id, GET /customers/:id/token-link, PUT /customers/:id, PATCH /customers/:id/deactivate | ✅ Customer | ✅ | ✅ 200/201/401/403/404 | ✅ | ✅ |

### ❌ Missing Swagger (no decorators)

| Module | Controller | Endpoints | Notes |
|--------|------------|-----------|--------|
| Auth | AuthController | POST /auth/login, POST /auth/register, POST /auth/refresh | No ApiTags, ApiOperation, ApiResponse, ApiProperty on DTOs |
| Identity | UserController | POST /users, GET /users/:id, PATCH /users/:id | No ApiTags, ApiOperation, ApiResponse, ApiBearerAuth |
| ExchangeRate | ExchangeRateController | POST /exchange-rates, GET /exchange-rates/latest | No ApiTags, ApiOperation, ApiResponse, ApiBearerAuth |
| Order | OrderController | POST /orders, GET /orders, GET /orders/:id, POST /orders/:id/items, POST /orders/:id/customer-orders | No ApiTags, ApiOperation, ApiResponse, ApiBearerAuth |
| Payment | PaymentController | POST /payments, GET /payments/by-order/:orderId, POST /payments/:id/verify, POST /payments/:id/reject | No ApiTags, ApiOperation, ApiResponse, ApiBearerAuth |
| Arrival | ArrivalController | POST /arrivals, GET /arrivals/by-order/:orderId | No ApiTags, ApiOperation, ApiResponse, ApiBearerAuth |
| Notification | NotificationController | POST /notifications/send, GET /notifications/history | No ApiTags, ApiOperation, ApiResponse, ApiBearerAuth |

### ⚠️ Incomplete Swagger

| Module | Issue |
|--------|--------|
| Customer | Missing @ApiResponse(400) for validation errors on create/update |
| App | Missing 401 if ever protected |

### 📋 Modules Not Present in Codebase

| Module | Status |
|--------|--------|
| Merchant | ❌ No Merchant controller/module found |
| CustomerOrder | ✅ Part of Order module (POST /orders/:id/customer-orders) |
| CustomerMessage | ❌ No CustomerMessage module found |

---

## 3. Swagger Checklist (per endpoint)

| Module | Controller | Method | Endpoint | ApiTags | ApiOperation | 200/201 | 400 | 401 | 403 | 404 | ApiBearerAuth | DTO ApiProperty |
|--------|------------|--------|----------|---------|--------------|---------|-----|-----|-----|-----|---------------|-----------------|
| App | AppController | GET | / | ✅ | ✅ | ✅ | - | - | - | - | N/A | N/A |
| Auth | AuthController | POST | /auth/login | ❌ | ❌ | ❌ | ❌ | ❌ | - | - | N/A | ❌ |
| Auth | AuthController | POST | /auth/register | ❌ | ❌ | ❌ | ❌ | ❌ | - | - | N/A | ❌ |
| Auth | AuthController | POST | /auth/refresh | ❌ | ❌ | ❌ | ❌ | ❌ | - | - | N/A | ❌ |
| Identity | UserController | POST | /users | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | Partial |
| Identity | UserController | GET | /users/:id | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ❌ | - |
| Identity | UserController | PATCH | /users/:id | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Partial |
| Customer | CustomerController | POST | /customers | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | - | ✅ | ✅ |
| Customer | CustomerController | GET | /customers | ✅ | ✅ | ✅ | - | ✅ | ✅ | - | ✅ | - |
| Customer | CustomerController | GET | /customers/:id | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | - |
| Customer | CustomerController | GET | /customers/:id/token-link | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | - |
| Customer | CustomerController | PUT | /customers/:id | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Customer | CustomerController | PATCH | /customers/:id/deactivate | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ | - |
| ExchangeRate | ExchangeRateController | POST | /exchange-rates | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | ❌ |
| ExchangeRate | ExchangeRateController | GET | /exchange-rates/latest | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ❌ | - |
| Order | OrderController | POST | /orders | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | Partial |
| Order | OrderController | GET | /orders | ❌ | ❌ | ❌ | - | ❌ | ❌ | - | ❌ | - |
| Order | OrderController | GET | /orders/:id | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ❌ | - |
| Order | OrderController | POST | /orders/:id/items | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Partial |
| Order | OrderController | POST | /orders/:id/customer-orders | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Partial |
| Payment | PaymentController | POST | /payments | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | Partial |
| Payment | PaymentController | GET | /payments/by-order/:orderId | ❌ | ❌ | ❌ | - | ❌ | ❌ | - | ❌ | - |
| Payment | PaymentController | POST | /payments/:id/verify | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Partial |
| Payment | PaymentController | POST | /payments/:id/reject | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Partial |
| Arrival | ArrivalController | POST | /arrivals | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | ❌ |
| Arrival | ArrivalController | GET | /arrivals/by-order/:orderId | ❌ | ❌ | ❌ | - | ❌ | ❌ | ❌ | ❌ | - |
| Notification | NotificationController | POST | /notifications/send | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | - | ❌ | Partial |
| Notification | NotificationController | GET | /notifications/history | ❌ | ❌ | ❌ | - | ❌ | ❌ | - | ❌ | - |

---

## 4. E2E Test Coverage (after remediation)

| Module | Test File | Status |
|--------|-----------|--------|
| App | app.e2e-spec.ts | ✅ Exists |
| Middleware | middleware.e2e-spec.ts | ✅ Exists |
| Auth | auth.e2e-spec.ts | ✅ Generated |
| Identity | identity.e2e-spec.ts | ✅ Generated |
| Customer | customer.e2e-spec.ts | ✅ Exists |
| ExchangeRate | exchange-rate.e2e-spec.ts | ✅ Generated |
| Order | order.e2e-spec.ts | ✅ Generated |
| Payment | payment.e2e-spec.ts | ✅ Generated |
| Arrival | arrival.e2e-spec.ts | ✅ Generated |
| Notification | notification.e2e-spec.ts | ✅ Generated |
| Merchant | merchant.e2e-spec.ts | N/A (no module in codebase) |
| CustomerMessage | customer-message.e2e-spec.ts | N/A (no module in codebase) |

**Shared:** `test/helpers/e2e-helpers.ts` (createE2EApp, loginForE2E, authHeaders, cleanTables).  
**Env:** `.env.test.example` for E2E (TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_MERCHANT_ID).

---

## 5. Actions Taken (this audit)

1. **Swagger decorators added** to: Auth, Identity, ExchangeRate, Order, Payment, Arrival, Notification.
2. **Api-docs path:** Swagger path updated to `api-docs` in main.ts.
3. **E2E helpers** created: login, app bootstrap, DB cleanup.
4. **E2E test files** generated for: auth, identity, customer (enhanced), exchange-rate, order, payment, arrival, notification.
5. **.env.test.example** and **jest-e2e.json** updated as needed.

---

## 6. Recommendations

- Add `@ApiResponse({ status: 400, description: 'Validation error' })` to all POST/PUT/PATCH that use DTOs.
- Consider exposing Swagger at both `api/docs` and `api-docs` for consistency with requirements.
- Implement **Merchant** and **CustomerMessage** modules if required by product; then add Swagger and E2E.
- Run `pnpm run test:e2e` with MySQL test DB and `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, `TEST_MERCHANT_ID` set.
