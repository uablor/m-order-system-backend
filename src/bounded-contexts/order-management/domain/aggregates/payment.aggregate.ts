import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { PaymentRecordStatus } from '../value-objects/payment-record-status.vo';

export interface PaymentAggregateProps extends EntityProps {
  orderId: string;
  merchantId: string;
  customerId: string;
  paymentAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentProofUrl?: string;
  paymentAt?: Date;
  customerMessage?: string;
  status: PaymentRecordStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectReason?: string;
  notes?: string;
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
    if (!props.orderId?.trim()) throw new Error('Order is required');
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    if (!props.customerId?.trim()) throw new Error('Customer is required');
    if (typeof props.paymentAmount !== 'number' || props.paymentAmount <= 0)
      throw new Error('Payment amount must be a positive number');
    return new PaymentAggregate({
      ...props,
      status: 'PENDING',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: PaymentAggregateProps): PaymentAggregate {
    return new PaymentAggregate(props);
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get merchantId(): string {
    return this.props.merchantId;
  }
  get customerId(): string {
    return this.props.customerId;
  }
  get paymentAmount(): number {
    return this.props.paymentAmount;
  }
  get paymentDate(): Date {
    return this.props.paymentDate;
  }
  get paymentMethod(): string {
    return this.props.paymentMethod;
  }
  get paymentProofUrl(): string | undefined {
    return this.props.paymentProofUrl;
  }
  get paymentAt(): Date | undefined {
    return this.props.paymentAt;
  }
  get customerMessage(): string | undefined {
    return this.props.customerMessage;
  }
  get status(): PaymentRecordStatus {
    return this.props.status;
  }
  get verifiedBy(): string | undefined {
    return this.props.verifiedBy;
  }
  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt;
  }
  get rejectedBy(): string | undefined {
    return this.props.rejectedBy;
  }
  get rejectedAt(): Date | undefined {
    return this.props.rejectedAt;
  }
  get rejectReason(): string | undefined {
    return this.props.rejectReason;
  }
  get notes(): string | undefined {
    return this.props.notes;
  }

  verify(verifiedBy: string): void {
    if (this.props.status !== 'PENDING') throw new Error('Only PENDING payment can be verified');
    (this.props as PaymentAggregateProps).status = 'VERIFIED';
    (this.props as PaymentAggregateProps).verifiedBy = verifiedBy;
    (this.props as PaymentAggregateProps).verifiedAt = new Date();
    (this.props as PaymentAggregateProps).updatedAt = new Date();
  }

  reject(rejectedBy: string, reason?: string): void {
    if (this.props.status === 'VERIFIED')
      throw new Error('Cannot reject already verified payment');
    (this.props as PaymentAggregateProps).status = 'REJECTED';
    (this.props as PaymentAggregateProps).rejectedBy = rejectedBy;
    (this.props as PaymentAggregateProps).rejectedAt = new Date();
    (this.props as PaymentAggregateProps).rejectReason = reason;
    (this.props as PaymentAggregateProps).updatedAt = new Date();
  }
}
