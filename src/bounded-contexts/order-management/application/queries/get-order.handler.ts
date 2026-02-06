import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from './get-order.query';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

function toDto(aggregate: Awaited<ReturnType<IOrderRepository['findById']>>) {
  if (!aggregate) return null;
  return {
    id: aggregate.id.value,
    merchantId: aggregate.merchantId,
    createdBy: aggregate.createdBy,
    orderCode: aggregate.orderCode,
    orderDate: aggregate.orderDate,
    status: aggregate.status,
    arrivalStatus: aggregate.arrivalStatus,
    arrivedAt: aggregate.arrivedAt,
    notifiedAt: aggregate.notifiedAt,
    totalPurchaseCostLak: aggregate.totalPurchaseCostLak,
    totalShippingCostLak: aggregate.totalShippingCostLak,
    totalCostBeforeDiscountLak: aggregate.totalCostBeforeDiscountLak,
    totalDiscountLak: aggregate.totalDiscountLak,
    totalFinalCostLak: aggregate.totalFinalCostLak,
    totalFinalCostThb: aggregate.totalFinalCostThb,
    totalSellingAmountLak: aggregate.totalSellingAmountLak,
    totalSellingAmountThb: aggregate.totalSellingAmountThb,
    totalProfitLak: aggregate.totalProfitLak,
    totalProfitThb: aggregate.totalProfitThb,
    depositAmount: aggregate.depositAmount,
    paidAmount: aggregate.paidAmount,
    remainingAmount: aggregate.remainingAmount,
    paymentStatus: aggregate.paymentStatus,
    isClosed: aggregate.isClosed,
    items: aggregate.items.map((i) => ({
      id: typeof i.id === 'string' ? i.id : i.id.value,
      orderId: i.orderId,
      productName: i.productName,
      variant: i.variant,
      quantity: i.quantity,
      purchaseCurrency: i.purchaseCurrency,
      purchasePrice: i.purchasePrice,
      purchaseExchangeRate: i.purchaseExchangeRate,
      purchaseTotalLak: i.purchaseTotalLak,
      totalCostBeforeDiscountLak: i.totalCostBeforeDiscountLak,
      discountType: i.discountType,
      discountValue: i.discountValue,
      discountAmountLak: i.discountAmountLak,
      finalCostLak: i.finalCostLak,
      finalCostThb: i.finalCostThb,
      sellingPriceForeign: i.sellingPriceForeign,
      sellingExchangeRate: i.sellingExchangeRate,
      sellingTotalLak: i.sellingTotalLak,
      profitLak: i.profitLak,
      profitThb: i.profitThb,
    })),
    createdAt: aggregate.createdAt,
    updatedAt: aggregate.updatedAt,
  };
}

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repo: IOrderRepository,
  ) {}

  async execute(query: GetOrderQuery) {
    const aggregate = await this.repo.findById(query.id, query.merchantId);
    return toDto(aggregate);
  }
}
