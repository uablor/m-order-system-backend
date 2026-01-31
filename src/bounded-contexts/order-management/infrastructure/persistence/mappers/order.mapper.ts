import type { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderEntity as OrderEntityClass } from '../../../domain/entities/order.entity';
import type { OrderOrmEntity } from '../entities/order.orm-entity';

export function orderOrmToDomain(orm: OrderOrmEntity): OrderEntity {
  return OrderEntityClass.create({
    id: orm.domain_id,
    merchantId: orm.technical_merchant_id,
    createdBy: orm.technical_user_id,
    orderCode: orm.order_code,
    orderDate: orm.order_date,
    arrivalStatus: orm.arrival_status,
    totalFinalCostLak: Number(orm.total_final_cost_lak),
    totalFinalCostThb: Number(orm.total_final_cost_thb),
    totalSellingAmountLak: Number(orm.total_selling_amount_lak),
    totalSellingAmountThb: Number(orm.total_selling_amount_thb),
    paidAmount: Number(orm.paid_amount),
    remainingAmount: Number(orm.remaining_amount),
    paymentStatus: orm.payment_status,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function orderDomainToOrm(entity: OrderEntity): Partial<OrderOrmEntity> {
  return {
    domain_id: entity.id,
    technical_merchant_id: entity.merchantId,
    technical_user_id: entity.createdBy,
    order_code: entity.orderCode,
    order_date: entity.orderDate,
    arrival_status: entity.arrivalStatus,
    total_final_cost_lak: entity.totalFinalCostLak,
    total_final_cost_thb: entity.totalFinalCostThb,
    total_selling_amount_lak: entity.totalSellingAmountLak,
    total_selling_amount_thb: entity.totalSellingAmountThb,
    paid_amount: entity.paidAmount,
    remaining_amount: entity.remainingAmount,
    payment_status: entity.paymentStatus,
    updated_at: entity.updatedAt ?? new Date(),
  };
}
