import { Entity } from '../../../../shared/domain/entity-base';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { DiscountType } from '../value-objects/discount-type.vo';

export interface OrderItemEntityProps extends EntityProps {
  orderId: string;
  productName: string;
  variant: string;
  quantity: number;
  purchaseCurrency: string;
  purchasePrice: number;
  purchaseExchangeRate: number;
  purchaseTotalLak: number;
  totalCostBeforeDiscountLak: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmountLak: number;
  finalCostLak: number;
  finalCostThb: number;
  sellingPriceForeign: number;
  sellingExchangeRate: number;
  sellingTotalLak: number;
  profitLak: number;
  profitThb: number;
}

export class OrderItemEntity extends Entity<OrderItemEntityProps> {
  private constructor(props: OrderItemEntityProps) {
    super(props);
  }

  static create(
    props: Omit<OrderItemEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): OrderItemEntity {
    return new OrderItemEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get orderId(): string {
    return this.props.orderId;
  }
  get productName(): string {
    return this.props.productName;
  }
  get variant(): string {
    return this.props.variant;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get purchaseCurrency(): string {
    return this.props.purchaseCurrency;
  }
  get purchasePrice(): number {
    return this.props.purchasePrice;
  }
  get purchaseExchangeRate(): number {
    return this.props.purchaseExchangeRate;
  }
  get purchaseTotalLak(): number {
    return this.props.purchaseTotalLak;
  }
  get totalCostBeforeDiscountLak(): number {
    return this.props.totalCostBeforeDiscountLak;
  }
  get discountType(): DiscountType {
    return this.props.discountType;
  }
  get discountValue(): number {
    return this.props.discountValue;
  }
  get discountAmountLak(): number {
    return this.props.discountAmountLak;
  }
  get finalCostLak(): number {
    return this.props.finalCostLak;
  }
  get finalCostThb(): number {
    return this.props.finalCostThb;
  }
  get sellingPriceForeign(): number {
    return this.props.sellingPriceForeign;
  }
  get sellingExchangeRate(): number {
    return this.props.sellingExchangeRate;
  }
  get sellingTotalLak(): number {
    return this.props.sellingTotalLak;
  }
  get profitLak(): number {
    return this.props.profitLak;
  }
  get profitThb(): number {
    return this.props.profitThb;
  }

  /** Remaining quantity available for allocation to customer orders */
  getRemainingQuantity(allocatedQty: number): number {
    return Math.max(0, this.props.quantity - allocatedQty);
  }
}
