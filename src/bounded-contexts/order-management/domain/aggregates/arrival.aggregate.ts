import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { ArrivalItemEntity } from '../entities/arrival-item.entity';

export interface ArrivalAggregateProps extends EntityProps {
  orderId: string;
  merchantId: string;
  arrivedDate: Date;
  arrivedTime?: string;
  recordedBy: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED';
  items: ArrivalItemEntity[];
}

export class ArrivalAggregate extends AggregateRoot<ArrivalAggregateProps> {
  private constructor(props: ArrivalAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<ArrivalAggregateProps, 'createdAt' | 'updatedAt' | 'items'> & {
      createdAt?: Date;
      updatedAt?: Date;
      items?: ArrivalItemEntity[];
    },
  ): ArrivalAggregate {
    if (!props.orderId?.trim()) throw new Error('Order is required');
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    if (!props.recordedBy?.trim()) throw new Error('Recorded by is required');
    return new ArrivalAggregate({
      ...props,
      status: props.status ?? 'PENDING',
      items: props.items ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: ArrivalAggregateProps): ArrivalAggregate {
    return new ArrivalAggregate(props);
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get merchantId(): string {
    return this.props.merchantId;
  }
  get arrivedDate(): Date {
    return this.props.arrivedDate;
  }
  get arrivedTime(): string | undefined {
    return this.props.arrivedTime;
  }
  get recordedBy(): string {
    return this.props.recordedBy;
  }
  get notes(): string | undefined {
    return this.props.notes;
  }
  get status(): 'PENDING' | 'CONFIRMED' {
    return this.props.status;
  }
  get items(): ArrivalItemEntity[] {
    return this.props.items ?? [];
  }

  addItem(item: ArrivalItemEntity): void {
    (this.props as ArrivalAggregateProps).items = [...(this.props.items ?? []), item];
    (this.props as ArrivalAggregateProps).updatedAt = new Date();
  }

  confirm(): void {
    (this.props as ArrivalAggregateProps).status = 'CONFIRMED';
    (this.props as ArrivalAggregateProps).updatedAt = new Date();
  }
}
