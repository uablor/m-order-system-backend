import { Entity } from '../../../../shared/domain/entity-base';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface CustomerOrderItemEntityProps extends EntityProps {
  customerOrderId: string;
  orderItemId: string;
  quantity: number;
  sellingPriceForeign: number;
  sellingTotalLak: number;
  profitLak: number;
}

export class CustomerOrderItemEntity extends Entity<CustomerOrderItemEntityProps> {
  private constructor(props: CustomerOrderItemEntityProps) {
    super(props);
  }

  static create(
    props: Omit<CustomerOrderItemEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CustomerOrderItemEntity {
    return new CustomerOrderItemEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get customerOrderId(): string {
    return this.props.customerOrderId;
  }
  get orderItemId(): string {
    return this.props.orderItemId;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get sellingPriceForeign(): number {
    return this.props.sellingPriceForeign;
  }
  get sellingTotalLak(): number {
    return this.props.sellingTotalLak;
  }
  get profitLak(): number {
    return this.props.profitLak;
  }
}
