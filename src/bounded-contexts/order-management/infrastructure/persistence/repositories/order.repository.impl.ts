import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IOrderRepository,
  OrderRepositoryFindManyParams,
} from '../../../domain/repositories/order.repository';
import type { OrderAggregate } from '../../../domain/aggregates/order.aggregate';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
import { orderOrmToDomain, orderDomainToOrm } from '../mappers/order.mapper';
import { orderItemDomainToOrm } from '../mappers/order-item.mapper';

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderRepo: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly itemRepo: Repository<OrderItemOrmEntity>,
  ) {}

  async save(aggregate: OrderAggregate): Promise<OrderAggregate> {
    const orderId = aggregate.id.value;
    const ormOrder = this.orderRepo.create(
      orderDomainToOrm(aggregate) as Partial<OrderOrmEntity>,
    );
    ormOrder.order_id = orderId;
    await this.orderRepo.save(ormOrder);

    const existingIds = (
      await this.itemRepo.find({ where: { order_id: orderId }, select: ['item_id'] })
    ).map((r) => r.item_id);
    const currentIds = aggregate.items.map((i) =>
      typeof i.id === 'string' ? i.id : i.id.value,
    );
    for (const item of aggregate.items) {
      const itemId = typeof item.id === 'string' ? item.id : item.id.value;
      const ormItem = this.itemRepo.create(
        orderItemDomainToOrm(item, orderId) as Partial<OrderItemOrmEntity>,
      );
      ormItem.item_id = itemId;
      ormItem.order_id = orderId;
      await this.itemRepo.save(ormItem);
    }
    for (const id of existingIds) {
      if (!currentIds.includes(id)) await this.itemRepo.delete(id);
    }

    return this.findById(orderId) as Promise<OrderAggregate>;
  }

  async findById(id: string, merchantId?: string): Promise<OrderAggregate | null> {
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'items')
      .where('o.order_id = :id', { id });
    if (merchantId) qb.andWhere('o.merchant_id = :merchantId', { merchantId });
    const orm = await qb.getOne();
    return orm ? orderOrmToDomain(orm) : null;
  }

  async findByOrderCode(orderCode: string, merchantId: string): Promise<OrderAggregate | null> {
    const orm = await this.orderRepo.findOne({
      where: { order_code: orderCode, merchant_id: merchantId },
      relations: ['items'],
    });
    return orm ? orderOrmToDomain(orm) : null;
  }

  async findMany(params: OrderRepositoryFindManyParams): Promise<{
    data: OrderAggregate[];
    total: number;
  }> {
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'items')
      .where('o.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.fromDate) {
      qb.andWhere('o.order_date >= :fromDate', { fromDate: params.fromDate });
    }
    if (params.toDate) {
      qb.andWhere('o.order_date <= :toDate', { toDate: params.toDate });
    }
    qb.orderBy('o.order_date', 'DESC').addOrderBy('o.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(orderOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    await this.itemRepo.delete({ order_id: id });
    await this.orderRepo.delete(id);
  }
}
