import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { PaymentReceivedEvent } from '../events/payment-received.event';

export interface PaymentAggregateProps extends EntityProps {
  merchantId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: Date;
}

export class PaymentAggregate extends AggregateRoot<PaymentAggregateProps> {
  private constructor(props: PaymentAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<PaymentAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): PaymentAggregate {
    const agg = new PaymentAggregate({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
    agg.addDomainEvent(
      new PaymentReceivedEvent(agg.id, props.amount, props.orderId, props.paidAt),
    );
    return agg;
  }

  static fromPersistence(props: PaymentAggregateProps): PaymentAggregate {
    return new PaymentAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get orderId(): string {
    return this.props.orderId;
  }
  get amount(): number {
    return this.props.amount;
  }
  get currency(): string {
    return this.props.currency;
  }
  get status(): string {
    return this.props.status;
  }
  get paidAt(): Date {
    return this.props.paidAt;
  }
}
