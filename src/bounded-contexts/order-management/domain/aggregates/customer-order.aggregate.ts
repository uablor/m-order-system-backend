import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { CustomerOrderCreatedEvent } from '../events/customer-order-created.event';
import type { CustomerOrderItemEntity } from '../entities/customer-order-item.entity';

export interface CustomerOrderAggregateProps extends EntityProps {
  merchantId: string;
  customerId: string;
  orderId?: string;
  orderCode: string;
  orderDate: Date;
  status: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  items?: CustomerOrderItemEntity[];
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
    const agg = new CustomerOrderAggregate({
      ...props,
      items: props.items ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
    agg.addDomainEvent(
      new CustomerOrderCreatedEvent(
        agg.id,
        props.customerId,
        props.merchantId,
        props.orderCode,
        agg.createdAt,
      ),
    );
    return agg;
  }

  static fromPersistence(props: CustomerOrderAggregateProps): CustomerOrderAggregate {
    return new CustomerOrderAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get customerId(): string {
    return this.props.customerId;
  }
  get orderId(): string | undefined {
    return this.props.orderId;
  }
  get orderCode(): string {
    return this.props.orderCode;
  }
  get orderDate(): Date {
    return this.props.orderDate;
  }
  get status(): string {
    return this.props.status;
  }
  get totalAmount(): number {
    return this.props.totalAmount;
  }
  get currency(): string {
    return this.props.currency;
  }
  get paymentStatus(): string {
    return this.props.paymentStatus;
  }
  get items(): CustomerOrderItemEntity[] {
    return this.props.items ?? [];
  }
}
