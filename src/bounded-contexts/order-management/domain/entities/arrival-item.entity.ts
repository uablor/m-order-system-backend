import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export interface ArrivalItemProps extends EntityProps {
  arrivalId: string;
  orderItemId: string;
  quantityReceived: number;
  condition: string;
}

export class ArrivalItemEntity extends Entity<ArrivalItemProps> {
  private constructor(props: ArrivalItemProps) {
    super(props);
  }

  static create(props: ArrivalItemProps): ArrivalItemEntity {
    return new ArrivalItemEntity(props);
  }

  get arrivalId(): string {
    return this.props.arrivalId;
  }
  get orderItemId(): string {
    return this.props.orderItemId;
  }
  get quantityReceived(): number {
    return this.props.quantityReceived;
  }
  get condition(): string {
    return this.props.condition;
  }
}
