import { Entity } from '../../../../shared/domain/entity-base';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { DomainException } from '../../../../shared/domain/exceptions';

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
    if (!props.customerOrderId?.trim())
      throw new DomainException(
        'Customer order is required',
        'CUSTOMER_ORDER_ITEM_CUSTOMER_ORDER_REQUIRED',
      );
    if (!props.orderItemId?.trim())
      throw new DomainException(
        'Order item is required',
        'CUSTOMER_ORDER_ITEM_ORDER_ITEM_REQUIRED',
      );
    if (props.quantity == null || props.quantity <= 0)
      throw new DomainException(
        'Quantity must be greater than 0',
        'CUSTOMER_ORDER_ITEM_QUANTITY_INVALID',
      );
    return new CustomerOrderItemEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static allocate(
    props: Pick<
      CustomerOrderItemEntityProps,
      'id' | 'customerOrderId' | 'orderItemId' | 'quantity' | 'sellingPriceForeign'
    > & {
      sellingExchangeRate: number;
      unitCostLak: number;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CustomerOrderItemEntity {
    const sellingTotalLak = props.quantity * props.sellingPriceForeign * props.sellingExchangeRate;
    const allocatedCost = props.unitCostLak * props.quantity;
    const profitLak = sellingTotalLak - allocatedCost;
    return CustomerOrderItemEntity.create({
      id: props.id,
      customerOrderId: props.customerOrderId,
      orderItemId: props.orderItemId,
      quantity: props.quantity,
      sellingPriceForeign: props.sellingPriceForeign,
      sellingTotalLak,
      profitLak,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
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
