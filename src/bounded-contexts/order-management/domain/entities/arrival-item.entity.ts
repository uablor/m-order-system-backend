import { Entity } from '../../../../shared/domain/entity-base';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { ArrivalCondition } from '../value-objects/condition.vo';

export interface ArrivalItemEntityProps extends EntityProps {
  arrivalId: string;
  orderItemId: string;
  arrivedQuantity: number;
  condition: ArrivalCondition;
  notes?: string;
}

export class ArrivalItemEntity extends Entity<ArrivalItemEntityProps> {
  private constructor(props: ArrivalItemEntityProps) {
    super(props);
  }

  static create(
    props: Omit<ArrivalItemEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): ArrivalItemEntity {
    return new ArrivalItemEntity({
      ...props,
      condition: props.condition ?? 'OK',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get arrivalId(): string {
    return this.props.arrivalId;
  }
  get orderItemId(): string {
    return this.props.orderItemId;
  }
  get arrivedQuantity(): number {
    return this.props.arrivedQuantity;
  }
  get condition(): ArrivalCondition {
    return this.props.condition;
  }
  get notes(): string | undefined {
    return this.props.notes;
  }
}
