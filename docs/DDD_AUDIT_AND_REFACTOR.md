# DDD Audit and Refactoring Plan

**Project:** M-Order System Backend (NestJS)  
**Scope:** Full codebase audit for Domain-Driven Design compliance and production-grade architecture.

---

## 1️⃣ UNDERSTANDING THE BUSINESS

### Core Domain
- **Order Management:** Merchants create orders (with items), track arrival, split orders by customer (customer-orders), and manage payments. Orders have totals, payment status, arrival status, and profit calculations.
- **Payment:** Payments are recorded against orders/customers; they can be verified or rejected. Verification updates order paid/remaining amounts and payment status.
- **Arrival:** Recording when goods arrive; updates order arrival status and timestamps.

### Supporting Domains
- **Identity & Access:** Users, roles, permissions, merchants. Authentication (JWT), password hashing, role-based access.
- **Merchant:** Multi-tenant; merchants own orders, customers, rates, notifications.
- **Customer:** Customers belong to a merchant; have contact info, type (CUSTOMER/AGENT), and link to customer-orders.
- **Exchange Rate:** Per-merchant rates (BUY/SELL) by date/currency; used for order and payment calculations.
- **Notification:** Sending notifications (e.g. LINE, WhatsApp, FB) to customers; history and retry.

### Generic / CRUD-Only
- **Exchange Rate:** Create rate, get latest by (merchant, currency, date, type). Duplicate check is the only rule → **supporting, thin domain**.
- **Merchant:** Create/find by name. No complex rules → **supporting, thin domain**.
- **Notification:** Send + history. Delivery and retry are infra concerns; entity has `markSent`/`markFailed` → **supporting**.

### Main Business Flows
1. **Create Order** → Add items (with costs, discounts, selling prices, exchange rates) → Order totals and payment status derived.
2. **Create Customer Order** → Allocate order items to a customer with quantities/prices → Customer-order totals and payment status.
3. **Record Payment** → Create payment (PENDING) → Verify or Reject. Verify: update order paid/remaining and payment status.
4. **Record Arrival** → Record arrival with items/quantities/conditions → Update order arrival status and timestamps.

### Important Business Rules (Invariants)
- Order code must be unique per merchant.
- Customer order items must reference order items; quantity cannot exceed order item quantity.
- Arrival quantity per item cannot exceed order item quantity.
- Only PENDING payments can be verified or rejected.
- Remaining amount = total selling − paid; payment status = UNPAID | PARTIAL | PAID from paid vs total.
- Profit and totals (cost, selling, discount) must be consistent at order and item level.

### Aggregates That Should Exist
- **Order (Aggregate Root):** Order + OrderItems + CustomerOrders (each with CustomerOrderItems). Consistency boundary: totals, payment status, arrival status, and all item-level calculations.
- **Payment:** Payment is its own aggregate (reference order/customer by ID); verify/reject are payment lifecycle.
- **Arrival:** Arrival + ArrivalItems; references Order. Record arrival and update Order’s arrival status in one consistency boundary (or via domain event).
- **Identity:** User (with Role, Permission references); Merchant; separate small aggregates.
- **Customer:** Customer aggregate (CRUD + activate/deactivate, update profile).

---

## 2️⃣ ARCHITECTURE PROBLEMS FOUND

1. **Business logic in Use Cases instead of Domain**  
   Order and customer-order creation do all calculations (totals, profit, payment status, remaining amount) in use cases. Entities are built with pre-calculated values and only expose static helpers (`calculateRemainingAmount`, `derivePaymentStatus`, `calculateProfitLak`). True DDD would have the **Order aggregate** own these rules (e.g. `addItem()`, `addCustomerOrder()`, `recalculateTotals()`).

2. **Infrastructure bypasses Repository for cross-aggregate updates**  
   - **PaymentVerificationServiceImpl:** After `payment.verify(verifiedBy)` it updates the **order** via `tx.getRepository(OrderOrmEntity)` and direct field assignment (`orderOrm.paid_amount = ...`), instead of loading Order aggregate, applying a domain method (e.g. `order.recordPayment(paymentAmount)`), and persisting via `IOrderRepository.save(order)`.
   - **ArrivalRecordingServiceImpl:** Updates order arrival status by creating a new `OrderEntity` and then persisting via raw TypeORM transaction (`tx.getRepository(OrderOrmEntity)`), not via `IOrderRepository.save(order)`.

3. **Domain “exception” is framework-coupled**  
   `shared/exceptions/domain.exception.ts` extends `HttpException` from `@nestjs/common`. Domain and application layers should not depend on HTTP or Nest. Domain should define a **framework-free** error type; presentation/filters map it to HTTP status and body.

4. **Anemic or semi-anemic entities**  
   - **OrderEntity, OrderItemEntity, CustomerOrderEntity, CustomerOrderItemEntity:** Mostly getters + static calculation helpers. No invariants enforced in `create()` (e.g. non-negative amounts, consistency between item totals and order totals). Logic lives in use cases.
   - **MerchantEntity, ExchangeRateEntity, ArrivalEntity, PermissionEntity, RoleEntity:** Pure data containers; no behavior beyond `create()`.
   - **CustomerEntity, NotificationEntity:** Have some behavior (`activate`, `deactivate`, `updateProfile`, `markSent`, `markFailed`) but **mutate state in place** instead of returning new instances; mixed with anemic style.

5. **No explicit Aggregates**  
   No aggregate root type or folder. Order is the natural aggregate root for Order + Items + CustomerOrders, but the code does not express that; repositories accept multiple entities and “saveWithItems”/“saveCustomerOrder” without a single root that enforces invariants.

6. **No Domain Events**  
   No `IDomainEvent`, no “PaymentVerified”, “OrderArrived”, “OrderCreated”. Cross-aggregate and side effects (e.g. notification, order status updates) are done with direct calls and ad-hoc transactions instead of events.

7. **Duplicate and mixed concepts: Payment Status**  
   `shared/enums/payment-status.enum.ts` (enum) and `order/domain/value-objects/payment-status.vo.ts` (const + type + `derivePaymentStatus`) both define payment status. Domain should own one concept; shared enums should not duplicate domain value objects.

8. **Read vs Write model not separated**  
   Same entities and repositories used for commands and queries. List orders, get payment by order, notification history are query use cases but use the same domain entities and repositories. For scalability and clarity, consider read models/DTOs for queries (CQRS-lite).

9. **CustomerEntity mutates in place**  
   `activate()`, `deactivate()`, `updateProfile()` mutate `this.props` and return `void`. This breaks expectations of immutability and makes reasoning and testing harder. Prefer returning a new entity instance (as in PaymentEntity.verify/reject and UserEntity.activate/deactivate).

10. **Repository interface in Application vs Domain**  
    Repository interfaces are in `domain/repositories` (correct). Some application use cases depend on **multiple repositories and infrastructure services** (e.g. Payment + Order, Arrival + Order). Cross-aggregate workflows are in application/infrastructure; that’s acceptable, but **persistence of each aggregate must go through its repository**, not raw ORM.

---

## 3️⃣ CURRENT ANTI-DDD PATTERNS (with file examples)

| Anti-pattern | Where |
|--------------|--------|
| Business logic in use case instead of aggregate | `order/application/commands/create-order.use-case.ts`: all totals, profit, payment status calculated in use case; entity only receives values. Same in `create-customer-order.use-case.ts`. |
| Static “helpers” instead of instance behavior | `order/domain/entities/order.entity.ts`, `customer-order.entity.ts`, `order-item.entity.ts`: `calculateRemainingAmount`, `derivePaymentStatus`, `calculateProfitLak` are static; totals are not enforced by the aggregate. |
| Infrastructure updates aggregate via ORM, not repository | `payment/infrastructure/services/payment-verification.service.impl.ts`: after `payment.verify()` it uses `tx.getRepository(OrderOrmEntity)` and sets `paid_amount`, `remaining_amount`, `payment_status` directly. `arrival/infrastructure/services/arrival-recording.service.impl.ts`: updates order via ORM in transaction instead of `IOrderRepository.save(order)`. |
| Domain exception extends framework | `shared/exceptions/domain.exception.ts`: `extends HttpException` from `@nestjs/common`. |
| Anemic entities | `merchant/domain/entities/merchant.entity.ts`, `exchange-rate/domain/entities/exchange-rate.entity.ts`, `arrival/domain/entities/arrival.entity.ts`: only props + getters + `create()`. |
| Mutable entity methods | `customer/domain/entities/customer.entity.ts`: `activate()`, `deactivate()`, `updateProfile()` mutate `this.props`. `notification/domain/entities/notification.entity.ts`: `markSent()`, `markFailed()`, `incrementRetry()` mutate state. |
| No aggregate root concept | Order + OrderItems + CustomerOrders are saved via `saveWithItems`, `saveCustomerOrder` without a single Order aggregate root that owns invariants. |
| Duplicate payment status definition | `shared/enums/payment-status.enum.ts` vs `order/domain/value-objects/payment-status.vo.ts`. |
| Money VO exists but not used in Order | `order/domain/value-objects/money.vo.ts` has validation and operations; Order/OrderItem use raw `number` for amounts. |

---

## 4️⃣ PROPOSED BOUNDED CONTEXTS

| Bounded Context | Responsibility | Core / Supporting |
|-----------------|----------------|-------------------|
| **Ordering** | Orders, order items, customer orders, customer order items; totals, payment status, arrival status, profit. | **Core** |
| **Payment** | Payment records; create, verify, reject. References Order/Customer by ID. | **Core** |
| **Arrival** | Arrival records and items; record arrival; update order arrival status. | **Supporting** |
| **Identity** | Users, roles, permissions; auth (token, password hash). | **Supporting** |
| **Merchant** | Merchants (tenant root). | **Supporting** |
| **Customer** | Customers per merchant; contact, type, activation. | **Supporting** |
| **Exchange Rate** | Rates per merchant/date/currency/type; create, get latest. | **Supporting** (thin) |
| **Notification** | Send and store notifications; channels (LINE, WhatsApp, etc.). | **Supporting** |

---

## 5️⃣ NEW FOLDER STRUCTURE (True DDD)

```
src/
├── shared/                          # Kernel: base types, no framework in domain types
│   ├── domain/
│   │   ├── base-entity.ts           # Move here; no Nest
│   │   ├── value-object.ts
│   │   └── domain-error.ts          # Pure TS; no HttpException
│   ├── exceptions/                  # HTTP mapping only (presentation)
│   │   ├── http-exception.mapper.ts # DomainError → HttpException
│   │   └── ...
│   ├── pagination/
│   ├── utils/
│   └── ...
├── modules/
│   ├── ordering/                    # Bounded context: Order aggregate
│   │   ├── domain/
│   │   │   ├── aggregates/
│   │   │   │   ├── order.aggregate.ts    # Root: Order + items + customerOrders
│   │   │   │   └── order.aggregate.types.ts
│   │   │   ├── entities/
│   │   │   │   ├── order-item.entity.ts
│   │   │   │   ├── customer-order.entity.ts
│   │   │   │   └── customer-order-item.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── money.vo.ts
│   │   │   │   ├── payment-status.vo.ts
│   │   │   │   ├── arrival-status.vo.ts
│   │   │   │   └── ...
│   │   │   ├── repositories/
│   │   │   │   └── order.repository.ts    # IOrderRepository
│   │   │   └── events/                   # Optional
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
│   ├── payment/
│   │   ├── domain/
│   │   │   ├── aggregates/              # Or single Payment entity as root
│   │   │   │   └── payment.aggregate.ts
│   │   │   ├── repositories/
│   │   │   └── ...
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interfaces/http/
│   ├── arrival/
│   ├── identity/
│   ├── merchant/
│   ├── customer/
│   ├── exchange-rate/
│   └── notification/
├── infrastructure/
│   └── database/
│       ├── data-source.ts
│       ├── migrations/
│       └── seeds/
└── app.module.ts
```

- **domain:** Entities, Value Objects, Aggregates, Repository **interfaces**, Domain Events. **Zero** Nest/TypeORM/Express.
- **application:** Use cases, DTOs, application mappers. May use Nest `@Injectable()` and inject repositories.
- **infrastructure:** Repository implementations, ORM entities, external services. Implements domain interfaces.
- **interfaces/http:** Controllers, guards, filters. Map DTOs ↔ use case input/output; map DomainError → HTTP.

---

## 6️⃣ AGGREGATES DESIGN

### Order (Aggregate Root)
- **Root:** Order.
- **Entities inside:** OrderItem, CustomerOrder, CustomerOrderItem.
- **Value objects:** Money, PaymentStatus, ArrivalStatus, OrderCode, DiscountType (and any other status/code VOs).
- **Invariants:**
  - Order code unique per merchant.
  - Totals (purchase, cost, discount, final, selling, profit) consistent with items.
  - `remainingAmount = totalSellingAmountLak - paidAmount` (≥ 0).
  - `paymentStatus` derived from paid vs total (UNPAID / PARTIAL / PAID).
  - Customer order quantities ≤ corresponding order item quantities; customer order totals consistent with items.
- **Domain methods (on Order aggregate):**
  - `Order.create(merchantId, createdBy, orderCode, orderDate, items?)` → enforces totals and payment status from items.
  - `addItem(itemProps)` → append item, recalculate order totals and payment status.
  - `addCustomerOrder(customerId, itemAllocations)` → create customer order and items, enforce quantities and totals.
  - `recordPayment(amount)` → increase paid, recompute remaining and payment status (or expose `updatePaymentSummary(paidAmount)` used by application after payment verification).
- **Persistence:** Only through `IOrderRepository.save(order)` (or saveWithItems that persists root + children in one transaction). No direct ORM updates to order/order_items/customer_orders from payment or arrival services.

### Payment (Aggregate)
- **Root:** Payment.
- **Value objects:** PaymentStatus (PENDING/VERIFIED/REJECTED), Money (optional for amount).
- **Invariants:** Only PENDING can be verified or rejected; verified/rejected are final.
- **Domain methods:** `verify(verifiedBy)`, `reject(rejectedBy, reason)` (already present; return new instance).
- **Persistence:** `IPaymentRepository.save(payment)`. When a payment is verified, **application** loads Order aggregate, calls `order.recordPayment(payment.paymentAmount)` (or equivalent), then `orderRepository.save(order)` and `paymentRepository.save(verifiedPayment)` in one transaction—no direct ORM on order.

### Arrival (Aggregate)
- **Root:** Arrival.
- **Entities:** ArrivalItem.
- **Invariants:** Arrived quantity ≤ order item quantity (can be enforced in Arrival or in application when creating arrival items).
- **Persistence:** `IArrivalRepository.save(arrival, items)`. Updating **order arrival status** must go through Order: load Order, call e.g. `order.markArrived(arrivedAt)`, then `orderRepository.save(order)` in the same transaction as saving arrival—no direct ORM on order.

### Identity (User, Role, Permission)
- **Aggregates:** User (root), Role (root), Permission (root). Small aggregates; reference each other by ID.
- **Value objects:** Email, Password (hash only in entity).
- **Domain methods:** User.activate(), User.deactivate(); Role.assignPermissions(); Permission is CRUD.

### Merchant
- **Aggregate:** Merchant (root). Thin; create/find by name. No complex rules.

### Customer
- **Aggregate:** Customer (root).
- **Value objects:** CustomerType, PreferredContactMethod.
- **Domain methods:** activate(), deactivate(), updateProfile(). Refactor to **return new instance** instead of mutating.

### Exchange Rate
- **Aggregate:** ExchangeRate (root). Thin; duplicate check per (merchant, date, currency, type). CRUD-like.

### Notification
- **Aggregate:** Notification (root). markSent(), markFailed(), incrementRetry(). Prefer immutable return (new instance) for consistency.

---

## 7️⃣ EXAMPLE REFACTOR

### Before: Order totals and payment status in Use Case
**File:** `order/application/commands/create-order.use-case.ts` (excerpt)
- Use case builds item entities, computes all totals, profit, payment status, then calls `OrderEntity.create({ ...allPreCalculated })` and `orderRepository.saveWithItems(order, itemEntities)`.

### After: Order as Aggregate Root with behavior
**Domain (order/domain/aggregates/order.aggregate.ts):**
```typescript
// Order is the aggregate root; it owns items and ensures invariants.
export class Order {
  private constructor(
    private readonly props: OrderProps,
    private readonly items: OrderItem[],
    private readonly customerOrders: CustomerOrder[],
  ) {}

  static create(
    id: string,
    merchantId: string,
    createdBy: string,
    orderCode: string,
    orderDate: Date,
    items: OrderItemProps[],
  ): Order {
    // Validate unique order code at persistence; here we only build.
    const orderItems = items.map((p) => OrderItem.create({ ...p, orderId: id }));
    const totals = OrderTotals.calculateFromItems(orderItems);
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

  addItem(props: OrderItemProps): Order {
    const newItem = OrderItem.create({ ...props, orderId: this.id });
    const newItems = [...this.items, newItem];
    const totals = OrderTotals.calculateFromItems(newItems);
    const paymentStatus = PaymentStatus.derive(
      totals.totalSellingLak,
      this.props.paidAmount,
    );
    return new Order(
      {
        ...this.props,
        ...totals,
        remainingAmount: Math.max(0, totals.totalSellingLak - this.props.paidAmount),
        paymentStatus,
        updatedAt: new Date(),
      },
      newItems,
      this.customerOrders,
    );
  }

  /** Called after payment is verified; keeps aggregate consistent. */
  recordPayment(paymentAmount: number): Order {
    const newPaid = Money.round(this.props.paidAmount + paymentAmount);
    const remaining = Money.round(Math.max(0, this.props.totalSellingAmountLak - newPaid));
    const paymentStatus = PaymentStatus.derive(
      this.props.totalSellingAmountLak,
      newPaid,
    );
    return new Order(
      {
        ...this.props,
        paidAmount: newPaid,
        remainingAmount: remaining,
        paymentStatus,
        updatedAt: new Date(),
      },
      this.items,
      this.customerOrders,
    );
  }

  markArrived(arrivedAt: Date): Order {
    return new Order(
      {
        ...this.props,
        arrivalStatus: ArrivalStatus.arrived(),
        arrivedAt: arrivedAt,
        updatedAt: new Date(),
      },
      this.items,
      this.customerOrders,
    );
  }

  get id(): string { return this.props.domainId; }
  get itemsSnapshot(): ReadonlyArray<OrderItem> { return this.items; }
  // ... getters for API/use case
}
```

**Application (create-order.use-case.ts):**
```typescript
async execute(command: CreateOrderCommand): Promise<Order> {
  const existing = await this.orderRepository.findByOrderCode(
    command.orderCode,
    command.merchantId,
  );
  if (existing) {
    throw new DomainError('ORDER_CODE_EXISTS', `Order code already exists`);
  }
  const orderId = generateUuid();
  const order = Order.create(
    orderId,
    command.merchantId,
    command.createdBy,
    command.orderCode,
    new Date(command.orderDate),
    command.items.map((i) => ({ ... })),
  );
  return this.orderRepository.save(order); // repo persists root + items in one tx
}
```

**Payment verification (infrastructure):**
- Load payment, call `payment.verify(verifiedBy)`.
- Load order, call `order.recordPayment(payment.paymentAmount)`.
- In one transaction: `paymentRepository.save(verifiedPayment)` and `orderRepository.save(order)`.
- No `tx.getRepository(OrderOrmEntity)` or direct field updates on ORM.

---

## 8️⃣ MISSING DOMAIN CONCEPTS

| Concept | Current state | Recommendation |
|--------|----------------|----------------|
| **Domain Error** | `DomainException` extends Nest `HttpException` | Introduce `DomainError` (or `DomainException`) in `shared/domain/` as a plain class with `code` and `message`. Map to HTTP in a global filter from `DomainError` → 422/409/404. |
| **Value Objects in Order** | Money VO exists but Order uses `number`; PaymentStatus/ArrivalStatus are types + functions | Use Money for amounts in Order/Payment where relevant. Use PaymentStatus/ArrivalStatus as VOs (immutable, validated) and derive in aggregate. |
| **Order Aggregate Root** | Order + items + customer orders saved separately; logic in use cases | Introduce Order as aggregate root with `create`, `addItem`, `addCustomerOrder`, `recordPayment`, `markArrived`. Repository saves root and children in one transaction. |
| **Domain Events** | None | Optional: `OrderCreated`, `PaymentVerified`, `OrderArrived`. Application or infra subscribes to update read models or trigger notifications. |
| **Repository usage in cross-aggregate flows** | Payment verification and arrival recording update order via ORM | Both should load Order, call domain method, then `orderRepository.save(order)` in same transaction as payment/arrival save. |
| **Immutability** | Customer, Notification mutate in place | Prefer `customer.activate()` returning new Customer; same for Notification. |
| **Single source for Payment Status** | shared/enums + order/domain/value-objects | Keep only domain VO; remove or deprecate shared enum; use VO in APIs and persistence mapping. |
| **Read models** | Queries use same entities/repos as commands | Optional: introduce query DTOs and read-only repos or projections for list/get history to scale and simplify queries. |

---

## 9️⃣ CRUD-ONLY (Not Full Domain)

- **Exchange Rate:** Create + get latest + duplicate check. No complex invariants → keep thin; entity + repo + use cases are enough; no need for rich aggregate behavior.
- **Merchant:** Create + find by name → keep as thin entity + repository.
- **Permission / Role:** Create, assign permissions, find by code/name → small aggregates; current structure is acceptable; ensure no framework in domain.

---

## 🔟 REFACTOR PRIORITY

1. **High:** Introduce framework-free `DomainError`; replace `DomainException` (HttpException) in domain/application with `DomainError`; map in filter.
2. **High:** Payment verification and arrival recording must update Order only via `IOrderRepository.save(order)` after calling domain methods on Order (e.g. `recordPayment`, `markArrived`).
3. **High:** Move order/customer-order calculation logic into Order aggregate (`create`, `addItem`, `addCustomerOrder`, `recordPayment`, `markArrived`); use cases only orchestrate and call repository.
4. **Medium:** Make Customer and Notification methods return new instances instead of mutating.
5. **Medium:** Consolidate payment status in domain VO; remove or alias shared enum.
6. **Medium:** Use Money VO in Order/Payment where it clarifies and prevents invalid amounts.
7. **Low:** Introduce domain events for OrderCreated, PaymentVerified, OrderArrived if you need decoupling and async side effects.
8. **Low:** Consider read models for list/history queries (CQRS-lite).

This document can be used as the single reference for the DDD refactor and for onboarding architects and developers.
