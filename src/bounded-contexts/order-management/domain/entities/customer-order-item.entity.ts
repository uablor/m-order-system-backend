import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export interface CustomerOrderItemProps extends EntityProps {
  customerOrderId: string;
  productRef: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export class CustomerOrderItemEntity extends Entity<CustomerOrderItemProps> {
  private constructor(props: CustomerOrderItemProps) {
    super(props);
  }

  static create(props: CustomerOrderItemProps): CustomerOrderItemEntity {
    return new CustomerOrderItemEntity(props);
  }

  get customerOrderId(): string {
    return this.props.customerOrderId;
  }
  get productRef(): string {
    return this.props.productRef;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get unitPrice(): number {
    return this.props.unitPrice;
  }
  get totalPrice(): number {
    return this.props.totalPrice;
  }
  get currency(): string {
    return this.props.currency;
  }
}
