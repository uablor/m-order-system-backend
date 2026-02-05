import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { CustomerOrderItemEntity } from '../entities/customer-order-item.entity';
import type { PaymentStatus } from '../value-objects/payment-status.vo';

export interface CustomerOrderAggregateProps extends EntityProps {
  orderId: string;
  customerId: string;
  merchantId: string;
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
    props: Omit<CustomerOrderAggregateProps, 'createdAt' | 'updatedAt' | 'items'> & {
      createdAt?: Date;
      updatedAt?: Date;
      items?: CustomerOrderItemEntity[];
    },
  ): CustomerOrderAggregate {
    if (!props.orderId?.trim()) throw new Error('Order is required');
    if (!props.customerId?.trim()) throw new Error('Customer is required');
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    return new CustomerOrderAggregate({
      ...props,
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

  addItem(item: CustomerOrderItemEntity): void {
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
}
