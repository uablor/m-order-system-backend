import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderProfitQuery } from './get-order-profit.query';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found-exception';

@QueryHandler(GetOrderProfitQuery)
export class GetOrderProfitHandler implements IQueryHandler<GetOrderProfitQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(query: GetOrderProfitQuery) {
    const order = await this.orderRepo.findById(query.orderId, query.merchantId);
    if (!order) {
      throw new NotFoundException('Order', query.orderId);
    }
    const costLak = order.totalFinalCostLak;
    const costThb = order.totalFinalCostThb;
    const revenueLak = order.totalSellingAmountLak;
    const revenueThb = order.totalSellingAmountThb;
    return {
      orderId: order.id,
      profitLak: revenueLak - costLak,
      profitThb: revenueThb - costThb,
      totalCostLak: costLak,
      totalCostThb: costThb,
      totalRevenueLak: revenueLak,
      totalRevenueThb: revenueThb,
    };
  }
}
