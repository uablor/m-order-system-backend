# Code Standards — DDD + Clean Architecture + NestJS Enterprise

**Document version:** 1.0  
**Based on:** Real project structure analysis (M-Order System Backend)  
**Architecture:** Domain-Driven Design, Clean Architecture, Modular Monolith, CQRS

---

## 1. Architecture Philosophy

### Why DDD (Domain-Driven Design)

- **Ubiquitous language:** Domain terms (Order, CustomerOrder, Arrival, Payment) are used consistently from API to persistence so that business and tech speak the same language.
- **Bounded contexts:** Each part of the system has a clear boundary and responsibility, reducing coupling and making evolution and scaling predictable.
- **Aggregate roots:** One entry point per consistency boundary protects invariants and keeps transactional boundaries explicit.
- **Domain purity:** Business rules live in the domain layer only; infrastructure and application orchestrate and persist, they do not decide “what is valid.”

### Why Bounded Context

- **order-management** and **user-management** are separate contexts with different lifecycles and rules. User/Merchant/Customer identity and auth belong in user-management; orders, payments, arrivals, and notifications belong in order-management.
- Context boundaries prevent “big ball of mud”: one context must not reach into another’s domain or repositories directly; integration is via ports, events, or well-defined APIs.

### Why CQRS

- **Commands** change state and go through aggregates; **queries** read data and may bypass domain for performance (e.g. read models, direct repository reads).
- Clear separation improves readability, testability, and future options (e.g. separate read stores, event sourcing).

### Why Aggregate Root Rule Is Sacred

- The aggregate root is the **only** entry point for changing an aggregate’s state. External callers (application services, handlers) load the root, call methods on it, then persist the root. They do not create or mutate entities inside the aggregate directly.
- This keeps invariants in one place (e.g. “order total must match sum of items,” “payment cannot exceed remaining amount”) and makes transactions and event emission predictable.

### Why Domain Must Be Pure

- Domain must have **zero** dependencies on frameworks (NestJS, TypeORM), HTTP, or infrastructure. It only depends on shared kernel (base types, value objects, domain event base).
- Pure domain is easy to unit test, refactor, and reuse; it can be moved to another runtime or service if needed.

---

## 2. Project Architecture Overview (Based on Real Project)

### Current Bounded Contexts

| Context               | Responsibility                                                                 | Root module                    |
|-----------------------|---------------------------------------------------------------------------------|--------------------------------|
| **user-management**   | Users, Merchants, Customers, Auth (JWT, roles, permissions), identity          | `user-management.module.ts`   |
| **order-management**  | Orders, CustomerOrders, Arrivals, Payments, Notifications, Exchange rates       | `order-management.module.ts`   |

- **user-management:** Single module; no sub-modules. Aggregates: User, Merchant, Customer. Domain services: PasswordHasher, TokenService (ports). Infrastructure: TypeORM entities, repositories, JWT/BCrypt.
- **order-management:** Root module owns CustomerOrder, Arrival, Notification, ExchangeRate (aggregates, application, infrastructure). **Sub-modules** `order/` and `payment/` own Order and Payment (their own domain, application, infrastructure, presentation). Root module imports `OrderModule` and `PaymentModule` and delegates Order/Payment to them.

### Sub-modules Inside a Bounded Context

- **order/** and **payment/** are **NestJS feature modules** inside the **same** bounded context (order-management). They are used to:
  - Group all Order- or Payment-related application/domain/infrastructure in one place.
  - Keep `order-management.module.ts` smaller and avoid registering duplicate handlers.
- Rule: Sub-modules **must** stay within the same bounded context. They must **not** duplicate the same aggregate in both root and sub-module (see “Detected violations and improvements” below).

### Cross-Context Dependency (Current)

- **order-management** imports **user-management** for:
  - **Auth:** `JwtAuthGuard`, `RolesGuard`, `Roles` decorator in controllers (allowed: presentation may depend on shared auth).
  - **Persistence join:** `CustomerOrderRepositoryImpl` uses `CustomerOrmEntity` from user-management in an `innerJoin` for queries. This is a **cross-context infrastructure dependency** and should be replaced by reference by ID or a port (see §6).

---

## 3. Folder Structure Standards (Strict)

### Bounded Context Template

```
bounded-contexts/
└ context-name/
   ├ application/           # Use cases: commands, queries, DTOs
   │  ├ commands/
   │  ├ queries/
   │  └ dto/
   ├ domain/                # Pure business logic
   │  ├ aggregates/
   │  ├ entities/
   │  ├ value-objects/
   │  ├ events/
   │  ├ exceptions/
   │  ├ repositories/      # Interfaces only
   │  └ services/           # Domain service ports (optional)
   ├ infrastructure/        # Persistence, external services, messaging
   │  ├ persistence/
   │  │  ├ entities/       # ORM entities only
   │  │  ├ mappers/
   │  │  └ repositories/   # Implementations
   │  ├ external-services/
   │  └ messaging/
   ├ presentation/          # HTTP/GraphQL controllers
   │  └ http/
   │     └ controllers/
   └ context-name.module.ts
```

- **application:** Orchestration only. No business rules; only mapping DTOs → commands/queries, calling domain (aggregates/repositories), and returning results.
- **domain:** No NestJS, no TypeORM, no HTTP. Only shared kernel + context value objects/entities/aggregates/events/repository interfaces.
- **infrastructure:** Implements domain ports (repositories, external services). Depends on domain interfaces, not the other way around.
- **presentation:** Thin controllers: parse request, build command/query, call CommandBus/QueryBus, return response. No business logic.

### Sub-module (e.g. order/, payment/) Template

Same layout as above, scoped to one aggregate (or a small cohesive set):

```
context-name/
└ order/
   ├ application/
   ├ domain/
   ├ infrastructure/
   ├ presentation/
   └ order.module.ts
```

- The context root module imports these sub-modules and re-exports what is needed (e.g. `ORDER_REPOSITORY`). Only one “owner” of the Order aggregate (either root or sub-module, not both).

---

## 4. Application Layer Rules

### Commands

- **MUST** change state (create/update/delete).
- **MUST** be handled by a single command handler.
- **MUST NOT** contain business logic; they are data containers (e.g. `CreateOrderCommand` with merchantId, orderCode, amounts, etc.).
- Naming: `CreateOrderCommand`, `RecordPaymentCommand`, `SendNotificationCommand`.

### Command Handlers

- **Orchestration only:** Load aggregate (or create via factory), call domain methods, save via repository, optionally dispatch domain events then clear them.
- **MUST NOT** contain business rules (e.g. “payment cannot exceed remaining amount” belongs in `PaymentAggregate` or Order aggregate).
- **MUST** depend on repository interfaces (tokens) from domain, not on concrete implementations.
- Naming: `CreateOrderHandler`, `RecordPaymentHandler`.

### Queries

- **MUST** be read-only (no state change).
- **MAY** bypass domain and use repository read methods or read models for performance.
- Naming: `GetOrderQuery`, `ListOrdersQuery`, `GetOrderProfitQuery`.

### Query Handlers

- **Read-only:** Return DTOs or domain entities for read use cases. No mutations.
- **MAY** use repository `findById`, `findMany`, or dedicated read services.

### DTOs

- Live in **application/dto/**.
- **MUST NOT** be in domain. Used for validation (e.g. class-validator) and API contract.
- Controllers map request body to DTO, then DTO to Command/Query.

---

## 5. Domain Layer Rules (Very Strict)

### Aggregate Root

- **ONLY** entry point for changing aggregate state. External code does not create or mutate child entities without going through the root.
- **MUST** protect invariants (e.g. totals, status transitions, non-negative amounts).
- **MUST** extend shared `AggregateRoot<T>` (or equivalent) and expose domain events.
- Naming: Prefer a dedicated class (e.g. `CustomerOrderAggregate`, `ArrivalAggregate`) over re-exporting an entity as “Aggregate” for consistency and future behavior (events, invariants).
- **One aggregate = one transaction boundary.** No multi-aggregate transactions (use sagas or eventual consistency if needed).

### Entities

- Have **identity** and **lifecycle**. Same ID = same entity.
- Child entities (e.g. `OrderItem`, `ArrivalItem`) are modified only via the aggregate root.
- **MUST NOT** contain ORM decorators or infrastructure types.

### Value Objects

- **Immutable.** No setters; create new instances to “change.”
- **Self-validating** in factory/create (e.g. `Money.create(amount, currency)` throws if invalid).
- Naming: `Money`, `OrderStatus`, `Quantity`, `UniqueEntityId` (from shared).

### Domain Events

- **Past tense:** `OrderCreatedEvent`, `PaymentReceivedEvent`, `CustomerOrderCreatedEvent`.
- Emit for **side effects** (notifications, integration, audit). Do not use for internal aggregate logic that could be a direct method call.
- **MUST** extend shared `BaseDomainEvent` (or implement `DomainEvent` interface) with `aggregateId`, `eventType`, `occurredAt`.
- After persisting the aggregate, the **application layer** (handler or a small service) should dispatch events and then call `aggregate.clearEvents()` so events are not fired twice.

### Repositories (Domain)

- **Interface only** in domain. Define `save`, `findById`, `findMany`, etc., using **domain** types (aggregate/entity), not ORM types.
- **MUST** be in `domain/repositories/` with a symbol token (e.g. `ORDER_REPOSITORY`) for DI.
- Implementation lives in **infrastructure** only.

---

## 6. Infrastructure Layer Rules

### ORM Entities

- **Persistence only.** Table name, columns, relations. **NO** business logic or domain behavior.
- **MUST** live in `infrastructure/persistence/entities/`. Naming: `*.orm-entity.ts` (e.g. `order.orm-entity.ts`).
- **MUST NOT** be imported by domain. Only infrastructure (mappers, repository impl) and config (e.g. `orm-entities.ts` for TypeORM) use them.

### Mappers

- **Required** between domain and ORM. One mapper per aggregate/entity (or cohesive group).
- Functions: `orderOrmToDomain(orm)`, `orderDomainToOrm(aggregate)` returning domain type or `Partial<OrmEntity>`.
- **MUST** live in `infrastructure/persistence/mappers/`. Domain must not depend on mappers.

### Repository Implementation

- Implements domain repository interface. Injects TypeORM `Repository<OrmEntity>`, uses mappers to convert to/from domain.
- **Only data access:** no business rules. Uses shared `getTransactionManager()` when running inside a transaction.
- Naming: `OrderRepositoryImpl`, `PaymentRepositoryImpl` (interface: `IOrderRepository` / `OrderRepository` in domain).

### Transaction Boundary

- **One aggregate = one transaction.** Save one root per transaction. For multi-step flows, use application-level coordination or sagas, not a single DB transaction spanning multiple aggregates.

---

## 7. Presentation Layer Rules

- **Controllers:** Thin. Parse request, validate (DTO), build command/query, execute via `CommandBus`/`QueryBus`, return response. **No** business logic.
- **Guards/decorators:** Auth (e.g. `JwtAuthGuard`, `RolesGuard`) may be shared from user-management; presentation can depend on these for security only.
- **Swagger:** Use `@ApiTags`, `@ApiOperation`, `@ApiResponse` for documentation. Keep DTOs as single source of truth for request/response shape.

---

## 8. Shared Kernel Rules (Very Strict)

**Location:** `src/shared/`

### Allowed in Shared

- **Base types:** `Entity`, `EntityProps`, `AggregateRoot` (from `shared/domain/`).
- **Domain event base:** `DomainEvent`, `BaseDomainEvent` (from `shared/domain/events/`).
- **Generic value objects:** `Money`, `Currency`, `UniqueEntityId`, `DateRange`, `ValueObject` base (from `shared/domain/value-objects/`).
- **Exceptions:** `DomainException`, `NotFoundException` (from `shared/domain/exceptions/`).
- **Infrastructure utilities:** `getTransactionManager`, `setTransactionManager` (from `shared/infrastructure/persistence/`).
- **Cross-cutting:** Logger, global filters, interceptors, middleware, UUID helper.

### Forbidden in Shared

- **Business rules** or context-specific logic.
- **Aggregates** or entities that belong to a bounded context.
- **Repository interfaces** that are context-specific (they belong in context domain).
- **DTOs** that are part of a use case (they belong in application layer of a context).

---

## 9. Naming Standards

| Artifact           | Convention              | Example                          |
|--------------------|-------------------------|----------------------------------|
| Command            | `{Verb}{Aggregate}Command` | `CreateOrderCommand`, `RecordPaymentCommand` |
| Command Handler    | `{Verb}{Aggregate}Handler` | `CreateOrderHandler`, `RecordPaymentHandler` |
| Query              | `Get{Thing}Query`, `List{Things}Query` | `GetOrderQuery`, `ListOrdersQuery` |
| Query Handler      | `Get{Thing}Handler`, `List{Things}Handler` | `GetOrderHandler`, `ListOrdersHandler` |
| Domain Event       | `{Aggregate}{PastVerb}Event` | `OrderCreatedEvent`, `PaymentReceivedEvent` |
| Repository (iface) | `I{Aggregate}Repository` or `{Aggregate}Repository` | `IOrderRepository` |
| Repository (impl)  | `{Aggregate}RepositoryImpl` | `OrderRepositoryImpl` |
| ORM Entity         | `{Aggregate}OrmEntity`  | `OrderOrmEntity`, `PaymentOrmEntity` |
| Aggregate          | `{Aggregate}Aggregate`  | `CustomerOrderAggregate`, `ArrivalAggregate` |
| Token              | `{AGGREGATE}_REPOSITORY` (Symbol) | `ORDER_REPOSITORY`, `PAYMENT_REPOSITORY` |

---

## 10. DDD Anti-Patterns (Must Detect and Avoid)

| Anti-pattern | Rule | Current project note |
|--------------|------|----------------------|
| Domain using ORM decorators | Domain must have zero `@Entity`, `@Column`, etc. | ✅ Not present in domain. |
| DTO inside domain | DTOs live in application (or presentation). | ✅ DTOs in application/dto. |
| Business logic in controller | Controllers only dispatch commands/queries. | ✅ Controllers use CommandBus/QueryBus. |
| Cross-context direct repository call | One context must not call another context’s repository or use its domain types. | ⚠️ order-management’s `CustomerOrderRepositoryImpl` uses user-management’s `CustomerOrmEntity` in a join. Prefer referencing customer by ID or a port. |
| Shared layer containing business rules | Shared = base types, value objects, cross-cutting only. | ✅ Shared is clean. |
| Aggregate calling another aggregate directly | Communicate via domain events or application service. | ✅ No direct aggregate-to-aggregate calls observed. |
| Duplicate aggregate ownership | One aggregate has one owner (one module). | ⚠️ Order and Payment exist at both root and in `order/` and `payment/` (handlers/entities/repos duplicated). Consolidate to sub-modules only and remove root-level Order/Payment application and infrastructure. |
| Repository interface in infrastructure | Repository interface belongs in domain. | ✅ Interfaces in domain, impl in infrastructure. |

---

## 11. Pagination Standard

- **All list APIs MUST use the shared pagination helper.** Use `paginateEntity` (or `paginateRaw`) from `shared/infrastructure/persistence/pagination` in repository implementations. Use `normalizePaginationParams` and `buildPaginationMeta` in query handlers to build the `pagination` object for the response envelope.
- **Controllers MUST use `@PaginationQuery()`** for list endpoints to parse `page` and `limit` from the query string. Use `BasePaginationQuery` (or equivalent) in application layer for list queries so page/limit are consistent (defaults: page 1, limit 20, max limit 100).
- **Pagination belongs to Application or Infrastructure.** Never Domain. Domain repository interfaces expose only `findMany(params)` returning `{ data: T[]; total: number }`; pagination meta (page, limit, totalPages, count) is added in the application layer (query handler) and in the response envelope.

---

## 12. Response Envelope Standard

- **All APIs MUST return the Global Response Contract** via the global response interceptor. Contract shape:
  - `status`: `"success"` | `"error"`
  - `message`: string
  - `data`: payload (or `null` on error)
  - `pagination?`: `{ total, count, limit, totalPages, currentPage }` for list responses
  - `error?`: `{ code, details? }` when `status === "error"`
- Use `ResponseBuilder.success(data)`, `ResponseBuilder.successPaginated(data, pagination)`, and `ResponseBuilder.error(message, code, details)` from `shared/application/response`. The **GlobalResponseInterceptor** wraps all successful handler returns into this envelope; the **GlobalExceptionFilter** uses `ResponseBuilder.error` for all error responses.

---

## 13. Mapper Enforcement Rule

- **Repository:** Returns **domain entities/aggregates** only. Infrastructure repository impl maps ORM → domain via mappers before returning.
- **Query handler:** Returns **read DTOs** (or plain objects used as DTOs) built from domain entities via mapping logic in the handler (or a dedicated read mapper). Never returns ORM entities.
- **Controller:** Never exposes ORM entities. Controllers only dispatch commands/queries and return the result of the bus; the interceptor wraps that in the response envelope.

---

## 14. Query Handler Output Rule

- **Query handlers MUST return DTOs only** (or objects that represent the read model). Map domain entities to a stable, documented shape (e.g. `{ id, email, fullName, ... }`). For list queries, return `{ data: DTO[], pagination }` so the global interceptor can wrap them in the response envelope with `pagination` included.

---

## 15. Transaction Rules

- **Aggregate = transaction boundary.** One transaction per aggregate save (one root and its children).
- **Never** span a single transaction across multiple aggregates (e.g. “save Order and Payment in one transaction”). Use application-level coordination or eventual consistency (e.g. saga, outbox).
- Use shared `setTransactionManager` / `getTransactionManager()` when a use case must run several repository operations in one transaction (e.g. same aggregate, multiple repos for same root). Ensure one root per transaction.

---

## 16. CQRS Rules

- **Command:** Write model. Changes state. Goes through aggregate root and repository.
- **Query:** Read model. No state change. May use repository find methods or dedicated read models; can bypass domain for performance.
- Do not use the same “model” for write and read if it forces compromise (e.g. denormalized read DTOs are allowed for queries).

---

## 17. Domain Event Rules

**When to use:**

- **Cross-aggregate:** One aggregate’s action triggers behavior in another (e.g. OrderCreated → reserve stock in another context).
- **Cross-context / integration:** Notify other contexts or systems (e.g. PaymentReceived → send to billing).
- **Notification / audit:** Side effects like email, logging, audit table.

**Implementation:**

- Aggregate raises events via `addDomainEvent(...)` in domain methods or factory.
- Handler (or application service) after `repository.save(aggregate)`:
  1. Dispatch each `aggregate.domainEvents` to an event bus or handlers.
  2. Call `aggregate.clearEvents()` so events are not re-dispatched.

---

## 18. Future Scaling Rules

- **Event-driven:** Domain events are the natural boundary for async integration and eventual consistency. Prefer events over direct HTTP calls between contexts.
- **Microservices split:** Bounded contexts map to potential services. Keep context boundaries strict and avoid cross-context repository/ORM coupling so each context can be extracted.
- **Outbox pattern:** For reliable event publishing, persist “outbox” records in the same transaction as the aggregate, then publish asynchronously.
- **Saga orchestration:** For multi-aggregate or multi-context flows, use sagas (choreography or orchestration) instead of distributed transactions.

---

## 19. Detected Violations and Suggested Improvements

Based on the current codebase:

1. **Order/Payment duplication**
   - **Issue:** Order and Payment have application commands, handlers, domain entities, repositories, and ORM entities both at `order-management/` root and inside `order/` and `payment/` sub-modules. Root `order-management.module` does not register `CreateOrderHandler` or `RecordPaymentHandler`; only `OrderModule` and `PaymentModule` do. Root-level order/payment code is effectively dead or redundant.
   - **Recommendation:** Treat **order/** and **payment/** as the single owner of Order and Payment. Remove from root: `application/commands/create-order.*`, `record-payment.*`, `send-notification` (if it belongs to payment/order flow), root `domain/entities/order.entity.ts`, `domain/aggregates/order.aggregate.ts`, `domain/repositories/order.repository.ts`, root `infrastructure/persistence/entities/order.orm-entity.ts`, `infrastructure/persistence/mappers/order.mapper.ts`, `infrastructure/persistence/repositories/order.repository.impl.ts`, and the same for Payment. Keep `config/orm-entities.ts` importing from `order/` and `payment/` only. Remove duplicate `presentation/http/controllers/order.controller.ts` at root (only one in `order/` is registered).

2. **Cross-context persistence dependency**
   - **Issue:** `CustomerOrderRepositoryImpl` (order-management) imports and uses `CustomerOrmEntity` (user-management) in an `innerJoin`. This ties order-management infrastructure to user-management’s persistence model.
   - **Recommendation:** Reference customer by ID only in order-management. If “customer must exist” or customer data is needed for the query, introduce a port in order-management (e.g. `CustomerResolverPort`) implemented by user-management (adapter that uses its repository) and inject that into the application layer; repository should not import another context’s ORM entity.

3. **Domain event dispatch**
   - **Issue:** Aggregates add domain events, but there is no visible dispatch and `clearEvents()` after save in handlers.
   - **Recommendation:** In each command handler that saves an aggregate, after `repo.save(aggregate)`: iterate `aggregate.domainEvents`, dispatch to an event bus or dedicated handlers, then call `aggregate.clearEvents()`.

4. **Aggregate naming consistency**
   - **Issue:** Some “aggregates” are re-exports of entities (e.g. `OrderEntity as OrderAggregate`, `UserEntity as UserAggregate`). Others are explicit classes (`CustomerOrderAggregate`, `ArrivalAggregate`).
   - **Recommendation:** Prefer explicit aggregate root classes (e.g. `OrderAggregate` extending `AggregateRoot`) that wrap or delegate to entities and own invariants and events. This makes the aggregate boundary clear and simplifies adding event and invariant logic later.

---

## 20. Summary

- **Architecture:** DDD + Clean Architecture + NestJS; modular monolith with **user-management** and **order-management**; CQRS for commands and queries.
- **Bounded context:** Strict boundaries; no direct repository or domain coupling across contexts; auth may be shared at presentation level.
- **Aggregate root:** Single entry point per aggregate; one transaction per root; no multi-aggregate transactions.
- **Domain:** Pure; no ORM or framework; repository interfaces and value objects in domain; ORM and mappers in infrastructure.
- **Shared kernel:** Only base types, value objects, domain event base, exceptions, and cross-cutting concerns; no business rules or context-specific aggregates.

This document reflects the **real** project structure and is intended as the single source of truth for DDD and Clean Architecture standards in this codebase. When in doubt, choose **strict DDD**, **domain purity**, and **aggregate isolation**.
