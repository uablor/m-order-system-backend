import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export interface OrderItemProps extends EntityProps {
  orderId: string;
  productRef: string;
  quantity: number;
  unitCost: number;
  unitSellingPrice: number;
  currency: string;
}

export class OrderItemEntity extends Entity<OrderItemProps> {
  private constructor(props: OrderItemProps) {
    super(props);
  }

  static create(props: OrderItemProps): OrderItemEntity {
    return new OrderItemEntity(props);
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get productRef(): string {
    return this.props.productRef;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get unitCost(): number {
    return this.props.unitCost;
  }
  get unitSellingPrice(): number {
    return this.props.unitSellingPrice;
  }
  get currency(): string {
    return this.props.currency;
  }
}
