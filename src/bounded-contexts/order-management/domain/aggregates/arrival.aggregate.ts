import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { ArrivalRecordedEvent } from '../events/arrival-recorded.event';
import type { ArrivalItemEntity } from '../entities/arrival-item.entity';

export interface ArrivalAggregateProps extends EntityProps {
  orderId: string;
  arrivalDate: Date;
  status: string;
  notes?: string;
  items?: ArrivalItemEntity[];
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
    const agg = new ArrivalAggregate({
      ...props,
      items: props.items ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
    agg.addDomainEvent(
      new ArrivalRecordedEvent(agg.id, props.orderId, props.arrivalDate, agg.createdAt),
    );
    return agg;
  }

  static fromPersistence(props: ArrivalAggregateProps): ArrivalAggregate {
    return new ArrivalAggregate(props);
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get arrivalDate(): Date {
    return this.props.arrivalDate;
  }
  get status(): string {
    return this.props.status;
  }
  get notes(): string | undefined {
    return this.props.notes;
  }
  get items(): ArrivalItemEntity[] {
    return this.props.items ?? [];
  }
}
