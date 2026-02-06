import { Entity } from '../../../../shared/domain/entity-base';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { DomainException } from '../../../../shared/domain/exceptions';
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

  private static computeTotals(params: {
    quantity: number;
    purchasePrice: number;
    purchaseExchangeRate: number;
    discountType: DiscountType;
    discountValue: number;
    sellingPriceForeign: number;
    sellingExchangeRate: number;
  }) {
    const purchaseTotalLak =
      params.quantity * params.purchasePrice * params.purchaseExchangeRate;
    const totalCostBeforeDiscountLak = purchaseTotalLak;
    const discountAmountLak =
      params.discountType === 'PERCENT'
        ? (totalCostBeforeDiscountLak * params.discountValue) / 100
        : params.discountValue;
    const finalCostLak = totalCostBeforeDiscountLak - discountAmountLak;
    const finalCostThb =
      params.purchaseExchangeRate > 0 ? finalCostLak / params.purchaseExchangeRate : 0;
    const sellingTotalLak =
      params.quantity * params.sellingPriceForeign * params.sellingExchangeRate;
    const profitLak = sellingTotalLak - finalCostLak;
    const profitThb = params.sellingExchangeRate > 0 ? profitLak / params.sellingExchangeRate : 0;

    return {
      purchaseTotalLak,
      totalCostBeforeDiscountLak,
      discountAmountLak,
      finalCostLak,
      finalCostThb,
      sellingTotalLak,
      profitLak,
      profitThb,
    };
  }

  static create(
    props: Omit<OrderItemEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): OrderItemEntity {
    if (!props.orderId?.trim())
      throw new DomainException('Order is required', 'ORDER_ITEM_ORDER_REQUIRED');
    if (!props.productName?.trim())
      throw new DomainException(
        'Product name is required',
        'ORDER_ITEM_PRODUCT_NAME_REQUIRED',
      );
    if (props.quantity == null || props.quantity <= 0)
      throw new DomainException(
        'Quantity must be greater than 0',
        'ORDER_ITEM_QUANTITY_INVALID',
      );
    return new OrderItemEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static createCalculated(
    props: Pick<
      OrderItemEntityProps,
      | 'id'
      | 'orderId'
      | 'productName'
      | 'variant'
      | 'quantity'
      | 'purchaseCurrency'
      | 'purchasePrice'
      | 'purchaseExchangeRate'
      | 'discountType'
      | 'discountValue'
      | 'sellingPriceForeign'
      | 'sellingExchangeRate'
    > & { createdAt?: Date; updatedAt?: Date },
  ): OrderItemEntity {
    const totals = OrderItemEntity.computeTotals({
      quantity: props.quantity,
      purchasePrice: props.purchasePrice,
      purchaseExchangeRate: props.purchaseExchangeRate,
      discountType: props.discountType,
      discountValue: props.discountValue,
      sellingPriceForeign: props.sellingPriceForeign,
      sellingExchangeRate: props.sellingExchangeRate,
    });
    return OrderItemEntity.create({
      ...props,
      purchaseTotalLak: totals.purchaseTotalLak,
      totalCostBeforeDiscountLak: totals.totalCostBeforeDiscountLak,
      discountAmountLak: totals.discountAmountLak,
      finalCostLak: totals.finalCostLak,
      finalCostThb: totals.finalCostThb,
      sellingTotalLak: totals.sellingTotalLak,
      profitLak: totals.profitLak,
      profitThb: totals.profitThb,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
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
