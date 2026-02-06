import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { DomainException } from '../../../../shared/domain/exceptions';
import type { CustomerOrderItemEntity } from '../entities/customer-order-item.entity';
import type { CustomerOrderStatus } from '../value-objects/customer-order-status.vo';
import type { PaymentStatus } from '../value-objects/payment-status.vo';

export interface CustomerOrderAggregateProps extends EntityProps {
  orderId: string;
  customerId: string;
  merchantId: string;
  status: CustomerOrderStatus;
  totalSellingAmountLak: number;
  totalPaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  items: CustomerOrderItemEntity[];
}

export class CustomerOrderAggregate extends AggregateRoot<CustomerOrderAggregateProps> {
  private constructor(props: CustomerOrderAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<CustomerOrderAggregateProps, 'createdAt' | 'updatedAt' | 'items' | 'status'> & {
      status?: CustomerOrderStatus;
      createdAt?: Date;
      updatedAt?: Date;
      items?: CustomerOrderItemEntity[];
    },
  ): CustomerOrderAggregate {
    if (!props.orderId?.trim())
      throw new DomainException('Order is required', 'CUSTOMER_ORDER_ORDER_REQUIRED');
    if (!props.customerId?.trim())
      throw new DomainException('Customer is required', 'CUSTOMER_ORDER_CUSTOMER_REQUIRED');
    if (!props.merchantId?.trim())
      throw new DomainException('Merchant is required', 'CUSTOMER_ORDER_MERCHANT_REQUIRED');
    return new CustomerOrderAggregate({
      ...props,
      status: props.status ?? 'DRAFT',
      totalSellingAmountLak: props.totalSellingAmountLak ?? 0,
      totalPaid: props.totalPaid ?? 0,
      remainingAmount: props.remainingAmount ?? 0,
      paymentStatus: props.paymentStatus ?? 'UNPAID',
      items: props.items ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: CustomerOrderAggregateProps): CustomerOrderAggregate {
    return new CustomerOrderAggregate(props);
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get customerId(): string {
    return this.props.customerId;
  }
  get merchantId(): string {
    return this.props.merchantId;
  }
  get status(): CustomerOrderStatus {
    return this.props.status;
  }
  get totalSellingAmountLak(): number {
    return this.props.totalSellingAmountLak;
  }
  get totalPaid(): number {
    return this.props.totalPaid;
  }
  get remainingAmount(): number {
    return this.props.remainingAmount;
  }
  get paymentStatus(): PaymentStatus {
    return this.props.paymentStatus;
  }
  get items(): CustomerOrderItemEntity[] {
    return this.props.items ?? [];
  }

  private assertDraft(action: string): void {
    if (this.props.status !== 'DRAFT') {
      throw new DomainException(
        `Customer order must be DRAFT to ${action}`,
        'CUSTOMER_ORDER_NOT_DRAFT',
      );
    }
  }

  addItem(item: CustomerOrderItemEntity): void {
    this.assertDraft('add items');
    const items = [...(this.props.items ?? []), item];
    (this.props as CustomerOrderAggregateProps).items = items;
    this.recalculateTotals();
  }

  recalculateTotals(): void {
    const items = this.props.items ?? [];
    const totalSelling = items.reduce((s, i) => s + i.sellingTotalLak, 0);
    const totalPaid = this.props.totalPaid ?? 0;
    const remaining = Math.max(0, totalSelling - totalPaid);
    let status: PaymentStatus = 'UNPAID';
    if (remaining <= 0) status = 'PAID';
    else if (totalPaid > 0) status = 'PARTIAL';
    (this.props as CustomerOrderAggregateProps).totalSellingAmountLak = totalSelling;
    (this.props as CustomerOrderAggregateProps).remainingAmount = remaining;
    (this.props as CustomerOrderAggregateProps).paymentStatus = status;
    (this.props as CustomerOrderAggregateProps).updatedAt = new Date();
  }

  recordPayment(amount: number): void {
    const totalPaid = (this.props.totalPaid ?? 0) + amount;
    const totalSelling = this.props.totalSellingAmountLak ?? 0;
    const remaining = Math.max(0, totalSelling - totalPaid);
    let status: PaymentStatus = 'UNPAID';
    if (remaining <= 0) status = 'PAID';
    else if (totalPaid > 0) status = 'PARTIAL';
    (this.props as CustomerOrderAggregateProps).totalPaid = totalPaid;
    (this.props as CustomerOrderAggregateProps).remainingAmount = remaining;
    (this.props as CustomerOrderAggregateProps).paymentStatus = status;
    (this.props as CustomerOrderAggregateProps).updatedAt = new Date();
  }

  submit(): void {
    if (this.props.status === 'SUBMITTED') return;
    this.assertDraft('submit');
    (this.props as CustomerOrderAggregateProps).status = 'SUBMITTED';
    (this.props as CustomerOrderAggregateProps).updatedAt = new Date();
  }

  complete(): void {
    if (this.props.status === 'COMPLETED') return;
    if (this.props.status === 'DRAFT') {
      throw new DomainException(
        'Customer order must be submitted before completion',
        'CUSTOMER_ORDER_NOT_SUBMITTED',
      );
    }
    (this.props as CustomerOrderAggregateProps).status = 'COMPLETED';
    (this.props as CustomerOrderAggregateProps).updatedAt = new Date();
  }
}
