# DDD Architectural Intervention

**Role:** Principal Domain Architect  
**Scope:** Full codebase rescue and redesign into true Domain-Driven Design with Clean Architecture.  
**Assumption:** Current architecture is layered CRUD pretending to be DDD. Redesign is required.  
**Design horizon:** 10 years, millions of users, large team collaboration.

---

## 1️⃣ Extracted Domains & Bounded Contexts

### Core Domain
| Bounded Context | Responsibility | Ubiquitous Language |
|-----------------|----------------|----------------------|
| **Ordering** | Orders, order items, customer orders (split by customer), totals, payment status, arrival status, profit. Order code uniqueness, item-level and order-level calculations. | Order, OrderItem, CustomerOrder, OrderCode, totals, paid amount, remaining amount, payment status (UNPAID/PARTIAL/PAID), arrival status, profit |
| **Payment** | Payment records against order/customer; create (PENDING), verify, reject. Lifecycle: PENDING → VERIFIED | REJECTED. | Payment, verify, reject, payment amount, verified by |

### Supporting Subdomains
| Bounded Context | Responsibility | Generic? |
|-----------------|----------------|----------|
| **Arrival** | Record arrival (date, time, items, quantities, condition); update order arrival status. | No — has rule: arrived quantity ≤ order item quantity. |
| **Identity** | Users, roles, permissions; JWT, password hashing; multi-tenant by merchant. | No — auth and authorization are supporting. |
| **Merchant** | Tenant root; merchants own orders, customers, rates. | **Yes** — create/find by name; no business rules. |
| **Customer** | Customers per merchant; contact, type (CUSTOMER/AGENT), activation, profile. | No — activation and profile are behavior. |
| **Exchange Rate** | Per-merchant rates (BUY/SELL) by date/currency; create, get latest; duplicate check. | **Yes** — single rule (no duplicate per merchant/date/currency/type); otherwise CRUD. |
| **Notification** | Send via channel (LINE, WhatsApp, FB); history; retry; mark sent/failed. | **Yes** — delivery and retry are infra; entity is a record. |

### Business Capabilities (High Level)
- Create order with items → derive totals, profit, payment status.
- Add order item → recalculate order.
- Create customer order (allocate items to customer) → enforce quantities, derive customer-order totals.
- Record payment → create PENDING; verify (update order paid/remaining) or reject.
- Record arrival → create arrival + items; update order arrival status.
- Identity: register, login, refresh; RBAC by role/permission.
- Customer: create, update profile, activate/deactivate.
- Exchange rate: create (no duplicate), get latest.
- Notification: send, list history.

### Real Business Rules (Invariants)
- Order code is unique per merchant.
- Customer order item quantity ≤ order item quantity.
- Arrival item quantity ≤ order item quantity.
- Only PENDING payments can be verified or rejected.
- `remainingAmount = totalSellingAmountLak - paidAmount` (≥ 0).
- `paymentStatus` = UNPAID | PARTIAL | PAID from paid vs total.
- Order totals (purchase, cost, discount, final, selling, profit) are consistent with items.
- Email uniqueness for users; password stored only as hash.

---

## 2️⃣ Architecture Problems Found

| # | Problem | Why It Is Wrong in DDD |
|---|--------|-------------------------|
| 1 | **Business logic in use cases** (create order, create customer order): all totals, profit, payment status, remaining amount are calculated in application layer; entities receive pre-calculated values. | Domain logic must live in the domain. Use cases orchestrate and call domain; they must not implement invariants or calculations that define “what an order is.” Otherwise the domain is anemic and cannot evolve or be tested in isolation. |
| 2 | **Infrastructure updates another aggregate via ORM** (payment verification and arrival recording): after calling domain on Payment/Arrival, order is updated via `tx.getRepository(OrderOrmEntity)` and direct field assignment. | Cross-aggregate changes must go through the aggregate root and its repository. Bypassing `IOrderRepository.save(order)` breaks consistency boundaries, hides business meaning, and makes it impossible to enforce invariants or emit domain events from Order. |
| 3 | **Domain “exception” extends framework** (`DomainException` extends Nest `HttpException`). | Domain must have zero framework imports. HTTP status and response shape are interface-layer concerns. Domain should expose a pure error type (e.g. `DomainError` with code/message); presentation maps it to HTTP. |
| 4 | **Anemic entities** (Order, OrderItem, CustomerOrder, Merchant, ExchangeRate, Arrival, Permission, Role): only data + getters + static helpers; no instance behavior that enforces rules. | In DDD, entities and aggregates are the place where invariants are enforced. If they only hold data, the domain model is fake; logic drifts into services/use cases and becomes duplicated and hard to change. |
| 5 | **No explicit aggregate roots** (Order + items + customer orders saved via `saveWithItems` / `saveCustomerOrder` without a single root type). | Aggregates define consistency boundaries. Without a clear root, transactional boundaries and ownership of invariants are unclear; multiple services can mutate the same conceptual aggregate in incompatible ways. |
| 6 | **No domain events** (e.g. OrderCreated, PaymentVerified, OrderArrived). | Events decouple aggregates and enable eventual consistency, auditing, and side effects (e.g. notifications) without putting orchestration in one place. Their absence forces direct coupling and ad-hoc transactions. |
| 7 | **Duplicate and mixed concepts** (payment status in `shared/enums` and `order/domain/value-objects`). | One concept, one place. Domain owns value objects and status semantics; shared enums create ambiguity and duplicate logic. |
| 8 | **Value objects underused** (Money exists but Order/Payment use raw numbers). | Value objects (Money, PaymentStatus, OrderCode) encode validation and meaning; primitives do not. Using numbers everywhere loses validation and makes wrong operations (e.g. mixing currencies) easy. |
| 9 | **Mutable entity methods** (Customer.activate/deactivate/updateProfile, Notification.markSent/markFailed mutate in place). | Mutating in place makes reasoning and testing harder and breaks expectations of immutability. Domain methods should return new instances (like Payment.verify/reject, User.activate/deactivate). |
| 10 | **Fat “domain” services in infrastructure** (PaymentVerificationServiceImpl, ArrivalRecordingServiceImpl): they orchestrate, load entities, call domain, then write via ORM to other aggregates. | Cross-aggregate workflow belongs in application (use case) or in domain services that work with repository interfaces. Infrastructure must only implement ports (repositories, gateways); it must not own the decision to update Order by touching ORM directly. |
| 11 | **No read/write separation** (same entities and repos for commands and queries). | At scale, read models often differ from write models. Using the same model for both limits optimization (e.g. projections, denormalization) and clutters the domain with query concerns. |
| 12 | **Repository interfaces in domain but persistence of other aggregates from infra** (order updated without IOrderRepository.save). | Repository abstraction is meaningless if infrastructure can bypass it. Every change to an aggregate must go through its repository interface so that invariants and transactions are consistent. |

---

## 3️⃣ Anti-DDD Patterns in Code

| Pattern | Location | What’s wrong |
|---------|-----------|--------------|
| Business logic in use case | `order/application/commands/create-order.use-case.ts` | Builds item entities, computes all totals, profit, payment status, remaining; passes values into `OrderEntity.create()`. |
| Business logic in use case | `order/application/commands/create-customer-order.use-case.ts` | Computes selling total, profit, remaining, payment status; builds customer order with pre-calculated values. |
| Static “helpers” instead of aggregate behavior | `order/domain/entities/order.entity.ts`, `customer-order.entity.ts`, `order-item.entity.ts` | `calculateRemainingAmount`, `derivePaymentStatus`, `calculateProfitLak` are static; totals not owned by aggregate. |
| Infrastructure mutates aggregate via ORM | `payment/infrastructure/services/payment-verification.service.impl.ts` | After `payment.verify()` uses `tx.getRepository(OrderOrmEntity)`, sets `paid_amount`, `remaining_amount`, `payment_status` directly. |
| Infrastructure mutates aggregate via ORM | `arrival/infrastructure/services/arrival-recording.service.impl.ts` | Updates order arrival status via `tx.getRepository(OrderOrmEntity)` instead of `IOrderRepository.save(order)`. |
| Domain exception = framework | `shared/exceptions/domain.exception.ts` | `extends HttpException` from `@nestjs/common`. |
| Anemic entity | `merchant/domain/entities/merchant.entity.ts`, `exchange-rate/domain/entities/exchange-rate.entity.ts`, `arrival/domain/entities/arrival.entity.ts` | Only props, getters, `create()`; no behavior. |
| Mutable entity methods | `customer/domain/entities/customer.entity.ts` | `activate()`, `deactivate()`, `updateProfile()` mutate `this.props`, return void. |
| Mutable entity methods | `notification/domain/entities/notification.entity.ts` | `markSent()`, `markFailed()`, `incrementRetry()` mutate state. |
| Duplicate domain concept | `shared/enums/payment-status.enum.ts` vs `order/domain/value-objects/payment-status.vo.ts` | Two definitions of payment status. |
| Value object unused | `order/domain/value-objects/money.vo.ts` | Order/OrderItem/Payment use raw `number` for amounts. |
| No aggregate root type | Order flow | `saveWithItems(order, itemEntities)`, `saveCustomerOrder(customerOrder, itemEntities)`; no single Order root that owns invariants. |

---

## 4️⃣ New System Architecture

- **Domain layer:** Pure business logic. Entities, aggregates, value objects, domain services, repository interfaces, domain events. **Zero** Nest, TypeORM, Express, or any framework import.
- **Application layer:** Use cases only. Orchestrate: load aggregate(s) via repository interfaces, call domain methods, persist via repository interfaces. May throw domain errors; no HTTP.
- **Infrastructure layer:** Implements ports. Repository implementations, ORM entities, external APIs (e.g. LINE, WhatsApp). Uses framework (TypeORM, Nest) only here. Does **not** update an aggregate by bypassing its repository.
- **Interface layer (HTTP):** Controllers, guards, filters. Map HTTP → DTOs → use case input; use case output → DTOs → HTTP. Map `DomainError` → status code and body.

**Cross-aggregate flows (e.g. “verify payment”):**  
Use case loads Payment and Order from their repositories, calls `payment.verify(verifiedBy)` and `order.recordPayment(payment.paymentAmount)`, then in one transaction calls `paymentRepository.save(verifiedPayment)` and `orderRepository.save(order)`. No direct ORM access to Order inside infrastructure “services.”

---

## 5️⃣ Folder Structure

```
src/
├── shared/
│   ├── domain/                    # Framework-free kernel
│   │   ├── base-entity.ts
│   │   ├── value-object.ts
│   │   └── domain-error.ts        # code, message; no HttpException
│   ├── exceptions/                # HTTP mapping only
│   │   └── http-exception.mapper.ts
│   ├── pagination/
│   └── utils/
│
├── modules/
│   ├── ordering/                  # Bounded context: Order aggregate
│   │   ├── domain/
│   │   │   ├── aggregates/
│   │   │   │   └── order.aggregate.ts      # Root: Order + items + customerOrders
│   │   │   ├── entities/
│   │   │   │   ├── order-item.entity.ts
│   │   │   │   ├── customer-order.entity.ts
│   │   │   │   └── customer-order-item.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── money.vo.ts
│   │   │   │   ├── payment-status.vo.ts
│   │   │   │   ├── arrival-status.vo.ts
│   │   │   │   ├── order-code.vo.ts
│   │   │   │   └── discount-type.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── order.repository.ts     # IOrderRepository
│   │   │   └── events/
│   │   │       └── order-created.event.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-order.use-case.ts
│   │   │   │   ├── add-order-item.use-case.ts
│   │   │   │   ├── create-customer-order.use-case.ts
│   │   │   │   ├── list-orders.use-case.ts
│   │   │   │   └── get-order-by-id.use-case.ts
│   │   │   ├── dto/
│   │   │   └── mappers/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── order.repository.impl.ts
│   │   │   │   ├── mappers/
│   │   │   │   └── orm-entities/
│   │   │   └── ...
│   │   └── interfaces/
│   │       └── http/
│   │           └── controllers/
│   │               └── order.controller.ts
│   │
│   ├── payment/
│   │   ├── domain/
│   │   │   ├── entities/          # Payment as root (or payment.aggregate.ts)
│   │   │   │   └── payment.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   └── payment-record-status.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── payment.repository.ts
│   │   │   └── events/
│   │   │       └── payment-verified.event.ts
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interfaces/http/
│   │
│   ├── arrival/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── events/
│   │   │       └── order-arrived.event.ts  # Optional
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interfaces/http/
│   │
│   ├── identity/
│   ├── merchant/
│   ├── customer/
│   ├── exchange-rate/
│   └── notification/
│
├── infrastructure/
│   └── database/
│       ├── data-source.ts
│       ├── migrations/
│       └── seeds/
└── app.module.ts
```

---

## 6️⃣ Aggregate Designs

### Order (Aggregate Root)
- **Root:** Order (single root type that holds items and customer orders).
- **Entities inside aggregate:** OrderItem, CustomerOrder, CustomerOrderItem.
- **Value objects:** Money, PaymentStatus, ArrivalStatus, OrderCode, DiscountType.
- **Invariants:**
  - Order code unique per merchant (enforced at persistence; use case checks before create).
  - Totals (purchase, cost, discount, final, selling, profit) consistent with items.
  - `remainingAmount = totalSellingAmountLak - paidAmount` (≥ 0).
  - `paymentStatus` = UNPAID | PARTIAL | PAID from paid vs total.
  - Customer order item quantity ≤ order item quantity; customer order totals consistent with items.
- **Domain methods (on Order):**
  - `Order.create(id, merchantId, createdBy, orderCode, orderDate, items)` → build items, compute totals, set payment status from paid=0.
  - `addItem(itemProps)` → new Order with appended item and recalculated totals.
  - `addCustomerOrder(customerId, itemAllocations)` → new Order with new CustomerOrder + items; enforce quantities and totals.
  - `recordPayment(amount)` → new Order with updated paidAmount, remainingAmount, paymentStatus.
  - `markArrived(arrivedAt)` → new Order with arrival status and timestamp.
- **Persistence:** Only via `IOrderRepository.save(order)` (persists root + items + customer orders in one transaction). No other module may update order tables via ORM.

### Payment (Aggregate Root)
- **Root:** Payment.
- **Value objects:** PaymentRecordStatus (PENDING/VERIFIED/REJECTED), Money (optional for amount).
- **Invariants:** Only PENDING can be verified or rejected; after that, status is final.
- **Domain methods:** `verify(verifiedBy)` → new Payment (VERIFIED); `reject(rejectedBy, reason)` → new Payment (REJECTED).
- **Persistence:** `IPaymentRepository.save(payment)`. When verifying, use case also loads Order, calls `order.recordPayment(amount)`, and saves both in one transaction via their repositories.

### Arrival (Aggregate Root)
- **Root:** Arrival; **entities:** ArrivalItem.
- **Invariants:** Arrived quantity ≤ order item quantity (enforced when building arrival items).
- **Persistence:** `IArrivalRepository.save(arrival, items)`. To update order arrival status: use case loads Order, calls `order.markArrived(arrivedAt)`, saves arrival and order in one transaction via repositories (no direct ORM on order).

### Identity: User, Role, Permission
- **Aggregates:** User (root), Role (root), Permission (root). Small; reference each other by ID.
- **Value objects:** Email, Password (hash only in entity).
- **Domain methods:** User.activate(), User.deactivate(); Role.assignPermissions(); Permission is create/find.

### Merchant
- **Aggregate:** Merchant (root). **Generic subdomain:** create, find by name; no complex rules.

### Customer
- **Aggregate:** Customer (root). **Domain methods:** activate(), deactivate(), updateProfile() — **return new instance**, do not mutate.

### Exchange Rate
- **Aggregate:** ExchangeRate (root). **Generic subdomain:** duplicate check per (merchant, date, currency, type); otherwise CRUD.

### Notification
- **Aggregate:** Notification (root). **Domain methods:** markSent(), markFailed(), incrementRetry() — prefer returning new instance.

---

## 7️⃣ Value Objects Needed

| Value Object | Bounded Context | Purpose |
|--------------|-----------------|---------|
| **Money** | Ordering, Payment | Amount + currency; validation (≥ 0); add/subtract; rounding. Use in Order/Payment amounts instead of raw number. |
| **PaymentStatus** (UNPAID/PARTIAL/PAID) | Ordering | Derive from paid vs total; single source of truth; remove shared enum. |
| **PaymentRecordStatus** (PENDING/VERIFIED/REJECTED) | Payment | Payment lifecycle; already implicit in entity; make explicit VO. |
| **ArrivalStatus** (NOT_ARRIVED/ARRIVED) | Ordering | Order arrival state. |
| **OrderCode** | Ordering | Valid order code format; uniqueness enforced at persistence. |
| **DiscountType** | Ordering | Percentage vs fixed; already in domain; ensure one place. |
| **Email** | Identity | Format validation; already exists. |
| **Password** | Identity | Hash only in domain; hashing in application/infra. |
| **CustomerType** (CUSTOMER/AGENT) | Customer | Already exists. |
| **PreferredContactMethod** | Customer | Already exists. |
| **RateType** (BUY/SELL) | Exchange Rate | Already in entity; can be VO. |

---

## 8️⃣ Domain Events Needed

| Event | When | Payload (minimal) | Subscribers (example) |
|-------|------|--------------------|------------------------|
| **OrderCreated** | After order (with items) is persisted | orderId, merchantId, orderCode, orderDate | Notification (send confirmation), analytics. |
| **PaymentVerified** | After payment is verified and order updated | paymentId, orderId, amount, verifiedBy | Notification (receipt), audit. |
| **OrderArrived** | After arrival is recorded and order marked arrived | orderId, arrivalId, arrivedAt | Notification (arrival notice). |

Implementation: simple interface `IDomainEvent` with `occurredAt`, `aggregateId`, optional payload. Application or infrastructure dispatches after saving; handlers are registered in composition root (e.g. Nest module). Start with in-process; later replace with message bus if needed.

---

## 9️⃣ Repository Interfaces Needed

| Interface | Bounded Context | Methods (summary) |
|-----------|-----------------|-------------------|
| **IOrderRepository** | Ordering | save(order): Promise<Order>; findById(id, merchantId); findByOrderCode(code, merchantId); findMany(params); delete(id, merchantId). Persists root + items + customer orders in one transaction where applicable. |
| **IPaymentRepository** | Payment | save(payment); findById(id, merchantId); findByOrderId(orderId, merchantId). |
| **IArrivalRepository** | Arrival | save(arrival, items); findByOrderId(orderId, merchantId). |
| **IUserRepository** | Identity | save(user); findById(id); findByEmail(email); findByEmailAndMerchant(email, merchantId). |
| **IRoleRepository** | Identity | save(role); findById(id); findByName(name); findByIdWithPermissions(id); assignPermissions(roleId, permissionIds). |
| **IPermissionRepository** | Identity | save(permission); findByCode(code); findAll(). |
| **IMerchantRepository** | Merchant | save(merchant); findById(id); findByName(name). |
| **ICustomerRepository** | Customer | save(customer); findById(id, merchantId); findMany(merchantId, params); existsByUniqueToken(token). |
| **IExchangeRateRepository** | Exchange Rate | save(rate); findLatest(merchantId, base, target, rateType, date); existsForDateAndCurrency(...). |
| **INotificationRepository** | Notification | save(notification); findMany(merchantId, filters, pagination). |

All interfaces live in **domain**; implementations in **infrastructure**. No aggregate is ever updated by another module’s infrastructure writing directly to its tables.

---

## 🔟 Example Refactors

### Controller — BEFORE → AFTER

**BEFORE** (controller doing mapping and knowing DTO shape; acceptable but we tighten to “orchestrate only”):

```typescript
// order/presentation/controllers/order.controller.ts (current)
async create(@Body() dto: CreateOrderDto) {
  const order = await this.createOrderUseCase.execute({
    merchantId: dto.merchantId,
    createdBy: dto.createdBy,
    orderCode: dto.orderCode,
    orderDate: dto.orderDate,
    arrivalStatus: dto.arrivalStatus,
    items: dto.items.map((item) => ({
      productName: item.productName,
      variant: item.variant,
      quantity: item.quantity,
      // ... many fields
    })),
  });
  return orderToResponseDto(order);
}
```

**AFTER** (controller only: parse body → use case → map result to HTTP; no business rules):

```typescript
// ordering/interfaces/http/controllers/order.controller.ts
@Post()
async create(@Body() dto: CreateOrderDto) {
  const command = this.createOrderDtoToCommand(dto);  // DTO → command in mapper
  const order = await this.createOrderUseCase.execute(command);
  return this.orderToResponseDto(order);              // domain → DTO
}
```

Controller stays thin: no calculation, no repository, no domain types in response (only DTOs).

---

### Service (Infrastructure) — BEFORE → AFTER

**BEFORE** (infrastructure updates Order via ORM):

```typescript
// payment/infrastructure/services/payment-verification.service.impl.ts
async verify(...): Promise<PaymentEntity> {
  const payment = await this.paymentRepository.findById(...);
  const verifiedPayment = payment.verify(verifiedBy);
  const order = await this.orderRepository.findById(...);
  const newPaidAmount = roundMoney(order.paidAmount + payment.paymentAmount);
  const newRemainingAmount = roundMoney(...);
  const newPaymentStatus = derivePaymentStatus(...);

  await this.dataSource.transaction(async (tx) => {
    const paymentRepo = tx.getRepository(PaymentOrmEntity);
    const orderRepo = tx.getRepository(OrderOrmEntity);
    // ...
    orderOrm.paid_amount = newPaidAmount;
    orderOrm.remaining_amount = newRemainingAmount;
    orderOrm.payment_status = newPaymentStatus;
    await orderRepo.save(orderOrm);
  });
  return verifiedPayment;
}
```

**AFTER** (verification is a use case; it uses domain + repositories only; infra only implements repos):

```typescript
// payment/application/use-cases/verify-payment.use-case.ts
async execute(command: VerifyPaymentCommand): Promise<Payment> {
  const payment = await this.paymentRepository.findById(command.paymentId, command.merchantId);
  if (!payment) throw new DomainError('PAYMENT_NOT_FOUND', 'Payment not found');
  const order = await this.orderRepository.findById(payment.orderId, command.merchantId);
  if (!order) throw new DomainError('ORDER_NOT_FOUND', 'Order not found');

  const verifiedPayment = payment.verify(command.verifiedBy);
  const updatedOrder = order.recordPayment(payment.paymentAmount);

  await this.unitOfWork.execute(async () => {
    await this.paymentRepository.save(verifiedPayment);
    await this.orderRepository.save(updatedOrder);
  });
  return verifiedPayment;
}
```

No `OrderOrmEntity` or `getRepository` in use case or in a “verification service”; only repository interfaces and domain methods.

---

### Model (Entity) — BEFORE → AFTER

**BEFORE** (anemic: data + static helpers):

```typescript
// order/domain/entities/order.entity.ts
export class OrderEntity extends BaseEntity<OrderEntityProps> {
  static create(props: ...): OrderEntity {
    return new OrderEntity({ ...props, createdAt: ..., updatedAt: ... });
  }
  get totalSellingAmountLak(): number { return this.props.totalSellingAmountLak; }
  // ... getters only
  static calculateRemainingAmount(totalSellingLak: number, paidAmount: number): number {
    return Math.max(0, Math.round((totalSellingLak - paidAmount) * 100) / 100);
  }
  static derivePaymentStatus(...): PaymentStatus { ... }
}
```

**AFTER** (aggregate root with behavior and invariants):

```typescript
// ordering/domain/aggregates/order.aggregate.ts
export class Order {
  private constructor(
    private readonly props: OrderProps,
    private readonly items: ReadonlyArray<OrderItem>,
    private readonly customerOrders: ReadonlyArray<CustomerOrder>,
  ) {}

  static create(
    id: string,
    merchantId: string,
    createdBy: string,
    orderCode: string,
    orderDate: Date,
    items: OrderItemProps[],
  ): Order {
    const orderItems = items.map((p) => OrderItem.create({ ...p, orderId: id }));
    const totals = OrderTotals.fromItems(orderItems);
    const paymentStatus = PaymentStatus.derive(totals.totalSellingLak, 0);
    return new Order(
      {
        domainId: id,
        merchantId,
        createdBy,
        orderCode,
        orderDate,
        arrivalStatus: ArrivalStatus.notArrived(),
        ...totals,
        paidAmount: 0,
        remainingAmount: totals.totalSellingLak,
        paymentStatus,
      },
      orderItems,
      [],
    );
  }

  recordPayment(amount: number): Order {
    const newPaid = Money.round(this.props.paidAmount + amount);
    const remaining = Money.round(Math.max(0, this.props.totalSellingAmountLak - newPaid));
    const paymentStatus = PaymentStatus.derive(this.props.totalSellingAmountLak, newPaid);
    return new Order(
      { ...this.props, paidAmount: newPaid, remainingAmount: remaining, paymentStatus, updatedAt: new Date() },
      this.items,
      this.customerOrders,
    );
  }

  markArrived(arrivedAt: Date): Order {
    return new Order(
      {
        ...this.props,
        arrivalStatus: ArrivalStatus.arrived(),
        arrivedAt,
        updatedAt: new Date(),
      },
      this.items,
      this.customerOrders,
    );
  }
  // ... addItem, addCustomerOrder, getters
}
```

Logic and invariants live in the aggregate; use cases call these methods and persist via repository.

---

### Use Case — BEFORE → AFTER

**BEFORE** (use case contains domain logic):

```typescript
// order/application/commands/create-order.use-case.ts
async execute(command: CreateOrderCommand): Promise<OrderEntity> {
  // ...
  const itemEntities: OrderItemEntity[] = command.items.map((item) => {
    const profitLak = OrderItemEntityClass.calculateProfitLak(item.sellingTotalLak, item.finalCostLak);
    const profitThb = item.finalCostThb > 0 ? profitLak / (item.finalCostLak / item.finalCostThb) : 0;
    return OrderItemEntityClass.create({ domainId: itemId, orderId, ... });
  });
  const totalPurchaseCostLak = itemEntities.reduce((sum, i) => sum + i.purchaseTotalLak, 0);
  // ... many lines of totals, payment status
  const order = OrderEntityClass.create({
    domainId: orderId,
    merchantId: command.merchantId,
    // ... all pre-calculated
  });
  const saved = await this.orderRepository.saveWithItems(order, itemEntities);
  return saved;
}
```

**AFTER** (use case orchestrates only; domain does the rest):

```typescript
// ordering/application/use-cases/create-order.use-case.ts
async execute(command: CreateOrderCommand): Promise<Order> {
  const existing = await this.orderRepository.findByOrderCode(command.orderCode, command.merchantId);
  if (existing) throw new DomainError('ORDER_CODE_EXISTS', 'Order code already exists for this merchant');

  const orderId = generateUuid();
  const order = Order.create(
    orderId,
    command.merchantId,
    command.createdBy,
    command.orderCode,
    new Date(command.orderDate),
    command.items.map((i) => ({ ... })),
  );

  return this.orderRepository.save(order);  // repo persists root + items in one tx
}
```

All calculations and rules are in `Order.create()` and value objects; use case only coordinates and persists.

---

### Repository — BEFORE → AFTER

**BEFORE** (infrastructure “service” that implements a port but writes to another aggregate’s table via ORM):

```typescript
// payment/infrastructure/services/payment-verification.service.impl.ts
await this.dataSource.transaction(async (tx) => {
  const orderRepo = tx.getRepository(OrderOrmEntity);
  const orderOrm = await orderRepo.findOne({ ... });
  orderOrm.paid_amount = newPaidAmount;
  orderOrm.remaining_amount = newRemainingAmount;
  orderOrm.payment_status = newPaymentStatus;
  await orderRepo.save(orderOrm);
});
```

**AFTER** (only repository implementations touch their own aggregate’s persistence):

```typescript
// ordering/infrastructure/persistence/order.repository.impl.ts
async save(order: Order): Promise<Order> {
  const orm = this.orderMapper.toOrm(order);
  const saved = await this.dataSource.getRepository(OrderOrmEntity).save(orm);
  // persist items and customer orders in same tx
  return this.orderMapper.toDomain(saved);
}
```

```typescript
// payment/application/use-cases/verify-payment.use-case.ts
await this.unitOfWork.execute(async () => {
  await this.paymentRepository.save(verifiedPayment);
  await this.orderRepository.save(updatedOrder);   // Order changed only via its repo
});
```

Payment infrastructure never touches `OrderOrmEntity`; only `IOrderRepository` implementation does.

---

## 🚨 Remove Fake Patterns — Not a Domain

| Area | Verdict | Action |
|------|---------|--------|
| **Exchange Rate** | Generic subdomain; one rule (no duplicate per merchant/date/currency/type). | Keep thin: entity + repo + use cases. No rich aggregate. Optionally move to “generic” or “reference data” in docs. |
| **Merchant** | CRUD + find by name; no business rules. | Keep as thin entity + repository. Do not inflate with domain behavior. |
| **Permission** | Create, findByCode, findAll. | Small aggregate or even “reference data”; ensure no framework in domain. |
| **Role** | Create, assign permissions, find. | Small aggregate; assignPermissions can stay in domain service or on Role. |
| **Notification** | Record of send + status; delivery/retry are infra. | Entity is a log entry; markSent/markFailed can be domain methods but consider “supporting” only; do not over-model. |

---

## Summary

- **Core domain:** Ordering (Order aggregate) and Payment (Payment aggregate). All invariant-preserving logic must live in these aggregates and their value objects.
- **Supporting:** Arrival, Identity, Customer; **generic:** Merchant, Exchange Rate; Notification is supporting with simple behavior.
- **Structural fixes:** Domain-only errors; no framework in domain; explicit Order aggregate with `create`, `addItem`, `addCustomerOrder`, `recordPayment`, `markArrived`; payment verification and arrival recording update Order only via `IOrderRepository.save(order)` inside a use case; repository interfaces in domain, implementations in infrastructure; optional domain events and read models for scale.
- **Refactor order:** (1) Introduce `DomainError` and map in HTTP layer. (2) Fix cross-aggregate updates to use Order aggregate + `IOrderRepository`. (3) Move order/customer-order logic into Order aggregate. (4) Add value objects (Money, single PaymentStatus). (5) Immutable Customer/Notification methods. (6) Domain events and CQRS-lite as needed.

This document is the single source of truth for the DDD rescue and redesign. Assume the current architecture is not correct and apply the redesign systematically.
