import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { OrderItemEntity } from '../entities/order-item.entity';
import type { ArrivalStatus } from '../value-objects/arrival-status.vo';
import type { PaymentStatus } from '../value-objects/payment-status.vo';

export interface OrderAggregateProps extends EntityProps {
  merchantId: string;
  createdBy: string;
  orderCode: string;
  orderDate: Date;
  arrivalStatus: ArrivalStatus;
  arrivedAt?: Date;
  notifiedAt?: Date;
  totalPurchaseCostLak: number;
  totalShippingCostLak: number;
  totalCostBeforeDiscountLak: number;
  totalDiscountLak: number;
  totalFinalCostLak: number;
  totalFinalCostThb: number;
  totalSellingAmountLak: number;
  totalSellingAmountThb: number;
  totalProfitLak: number;
  totalProfitThb: number;
  depositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  items: OrderItemEntity[];
  isClosed: boolean;
}

export class OrderAggregate extends AggregateRoot<OrderAggregateProps> {
  private constructor(props: OrderAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<OrderAggregateProps, 'createdAt' | 'updatedAt' | 'items'> & {
      createdAt?: Date;
      updatedAt?: Date;
      items?: OrderItemEntity[];
    },
  ): OrderAggregate {
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    if (!props.orderCode?.trim()) throw new Error('Order code is required');
    return new OrderAggregate({
      ...props,
      arrivalStatus: props.arrivalStatus ?? 'NOT_ARRIVED',
      paymentStatus: props.paymentStatus ?? 'UNPAID',
      totalPurchaseCostLak: props.totalPurchaseCostLak ?? 0,
      totalShippingCostLak: props.totalShippingCostLak ?? 0,
      totalCostBeforeDiscountLak: props.totalCostBeforeDiscountLak ?? 0,
      totalDiscountLak: props.totalDiscountLak ?? 0,
      totalFinalCostLak: props.totalFinalCostLak ?? 0,
      totalFinalCostThb: props.totalFinalCostThb ?? 0,
      totalSellingAmountLak: props.totalSellingAmountLak ?? 0,
      totalSellingAmountThb: props.totalSellingAmountThb ?? 0,
      totalProfitLak: props.totalProfitLak ?? 0,
      totalProfitThb: props.totalProfitThb ?? 0,
      depositAmount: props.depositAmount ?? 0,
      paidAmount: props.paidAmount ?? 0,
      remainingAmount: props.remainingAmount ?? 0,
      items: props.items ?? [],
      isClosed: props.isClosed ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: OrderAggregateProps): OrderAggregate {
    return new OrderAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get createdBy(): string {
    return this.props.createdBy;
  }
  get orderCode(): string {
    return this.props.orderCode;
  }
  get orderDate(): Date {
    return this.props.orderDate;
  }
  get arrivalStatus(): ArrivalStatus {
    return this.props.arrivalStatus;
  }
  get arrivedAt(): Date | undefined {
    return this.props.arrivedAt;
  }
  get notifiedAt(): Date | undefined {
    return this.props.notifiedAt;
  }
  get totalPurchaseCostLak(): number {
    return this.props.totalPurchaseCostLak;
  }
  get totalShippingCostLak(): number {
    return this.props.totalShippingCostLak;
  }
  get totalCostBeforeDiscountLak(): number {
    return this.props.totalCostBeforeDiscountLak;
  }
  get totalDiscountLak(): number {
    return this.props.totalDiscountLak;
  }
  get totalFinalCostLak(): number {
    return this.props.totalFinalCostLak;
  }
  get totalFinalCostThb(): number {
    return this.props.totalFinalCostThb;
  }
  get totalSellingAmountLak(): number {
    return this.props.totalSellingAmountLak;
  }
  get totalSellingAmountThb(): number {
    return this.props.totalSellingAmountThb;
  }
  get totalProfitLak(): number {
    return this.props.totalProfitLak;
  }
  get totalProfitThb(): number {
    return this.props.totalProfitThb;
  }
  get depositAmount(): number {
    return this.props.depositAmount;
  }
  get paidAmount(): number {
    return this.props.paidAmount;
  }
  get remainingAmount(): number {
    return this.props.remainingAmount;
  }
  get paymentStatus(): PaymentStatus {
    return this.props.paymentStatus;
  }
  get items(): OrderItemEntity[] {
    return this.props.items ?? [];
  }
  get isClosed(): boolean {
    return this.props.isClosed ?? false;
  }

  /** Recalculate order totals from items. Call after adding/updating items. */
  recalculateFromItems(): void {
    const items = this.props.items ?? [];
    let totalPurchase = 0;
    let totalCostBeforeDiscount = 0;
    let totalDiscount = 0;
    let totalFinalCostLak = 0;
    let totalFinalCostThb = 0;
    let totalSellingLak = 0;
    let totalSellingThb = 0;
    let totalProfitLak = 0;
    let totalProfitThb = 0;
    for (const item of items) {
      totalPurchase += item.purchaseTotalLak;
      totalCostBeforeDiscount += item.totalCostBeforeDiscountLak;
      totalDiscount += item.discountAmountLak;
      totalFinalCostLak += item.finalCostLak;
      totalFinalCostThb += item.finalCostThb;
      totalSellingLak += item.sellingTotalLak;
      totalProfitLak += item.profitLak;
      totalProfitThb += item.profitThb;
    }
    totalSellingThb = totalFinalCostLak > 0 && totalFinalCostThb > 0
      ? (totalSellingLak * totalFinalCostThb) / totalFinalCostLak
      : 0;
    (this.props as OrderAggregateProps).totalPurchaseCostLak = totalPurchase;
    (this.props as OrderAggregateProps).totalCostBeforeDiscountLak = totalCostBeforeDiscount;
    (this.props as OrderAggregateProps).totalDiscountLak = totalDiscount;
    (this.props as OrderAggregateProps).totalFinalCostLak = totalFinalCostLak;
    (this.props as OrderAggregateProps).totalFinalCostThb = totalFinalCostThb;
    (this.props as OrderAggregateProps).totalSellingAmountLak = totalSellingLak;
    (this.props as OrderAggregateProps).totalSellingAmountThb = totalSellingThb;
    (this.props as OrderAggregateProps).totalProfitLak = totalProfitLak;
    (this.props as OrderAggregateProps).totalProfitThb = totalProfitThb;
    (this.props as OrderAggregateProps).remainingAmount = totalSellingLak - (this.props.paidAmount ?? 0);
    (this.props as OrderAggregateProps).updatedAt = new Date();
  }

  addItem(item: OrderItemEntity): void {
    const items = [...(this.props.items ?? []), item];
    (this.props as OrderAggregateProps).items = items;
    this.recalculateFromItems();
  }

  removeItem(itemId: string): void {
    const items = (this.props.items ?? []).filter(
      (i) => (typeof i.id === 'string' ? i.id : i.id.value) !== itemId,
    );
    (this.props as OrderAggregateProps).items = items;
    this.recalculateFromItems();
  }

  updateItem(itemId: string, updated: OrderItemEntity): void {
    const items = (this.props.items ?? []).map((i) => {
      const id = typeof i.id === 'string' ? i.id : (i.id as { value: string }).value;
      return id === itemId ? updated : i;
    });
    (this.props as OrderAggregateProps).items = items;
    this.recalculateFromItems();
  }

  recordPayment(amount: number): void {
    const paid = (this.props.paidAmount ?? 0) + amount;
    const totalSelling = this.props.totalSellingAmountLak ?? 0;
    const remaining = Math.max(0, totalSelling - paid);
    let status: PaymentStatus = 'UNPAID';
    if (remaining <= 0) status = 'PAID';
    else if (paid > 0) status = 'PARTIAL';
    (this.props as OrderAggregateProps).paidAmount = paid;
    (this.props as OrderAggregateProps).remainingAmount = remaining;
    (this.props as OrderAggregateProps).paymentStatus = status;
    (this.props as OrderAggregateProps).updatedAt = new Date();
  }

  markArrived(arrivedAt?: Date): void {
    (this.props as OrderAggregateProps).arrivalStatus = 'ARRIVED';
    (this.props as OrderAggregateProps).arrivedAt = arrivedAt ?? new Date();
    (this.props as OrderAggregateProps).updatedAt = new Date();
  }

  close(): void {
    (this.props as OrderAggregateProps).isClosed = true;
    (this.props as OrderAggregateProps).updatedAt = new Date();
  }

  updateDetails(orderCode?: string, orderDate?: Date): void {
    if (orderCode != null && orderCode.trim()) (this.props as OrderAggregateProps).orderCode = orderCode;
    if (orderDate != null) (this.props as OrderAggregateProps).orderDate = orderDate;
    (this.props as OrderAggregateProps).updatedAt = new Date();
  }
}
