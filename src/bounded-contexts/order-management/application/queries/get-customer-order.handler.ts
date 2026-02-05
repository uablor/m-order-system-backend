import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerOrderQuery } from './get-customer-order.query';
import {
  CUSTOMER_ORDER_REPOSITORY,
  type ICustomerOrderRepository,
} from '../../domain/repositories/customer-order.repository';

@QueryHandler(GetCustomerOrderQuery)
export class GetCustomerOrderHandler implements IQueryHandler<GetCustomerOrderQuery> {
  constructor(
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly repo: ICustomerOrderRepository,
  ) {}

  async execute(query: GetCustomerOrderQuery) {
    const aggregate = await this.repo.findById(query.id);
    if (!aggregate) return null;
    return {
      id: aggregate.id.value,
      orderId: aggregate.orderId,
      customerId: aggregate.customerId,
      merchantId: aggregate.merchantId,
      totalSellingAmountLak: aggregate.totalSellingAmountLak,
      totalPaid: aggregate.totalPaid,
      remainingAmount: aggregate.remainingAmount,
      paymentStatus: aggregate.paymentStatus,
      items: aggregate.items.map((i) => ({
        id: typeof i.id === 'string' ? i.id : i.id.value,
        orderItemId: i.orderItemId,
        quantity: i.quantity,
        sellingPriceForeign: i.sellingPriceForeign,
        sellingTotalLak: i.sellingTotalLak,
        profitLak: i.profitLak,
      })),
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
