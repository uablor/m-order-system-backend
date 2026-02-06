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
    const domainId = aggregate.id.value;
    await this.orderRepo.manager.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderOrmEntity);
      const itemRepo = manager.getRepository(OrderItemOrmEntity);

      const ormOrder = orderRepo.create(orderDomainToOrm(aggregate) as Partial<OrderOrmEntity>);
      ormOrder.order_id = domainId;
      ormOrder.domain_id = domainId;
      await orderRepo.save(ormOrder);

      const existingIds = (
        await itemRepo.find({
          where: { order_id: domainId },
          select: ['item_id'],
        })
      ).map((r) => r.item_id);
      const currentIds = aggregate.items.map((i) =>
        typeof i.id === 'string' ? i.id : i.id.value,
      );
      for (const item of aggregate.items) {
        const itemDomainId = typeof item.id === 'string' ? item.id : item.id.value;
        const ormItem = itemRepo.create(
          orderItemDomainToOrm(item, domainId) as Partial<OrderItemOrmEntity>,
        );
        ormItem.item_id = itemDomainId;
        ormItem.domain_id = itemDomainId;
        ormItem.order_id = domainId;
        await itemRepo.save(ormItem);
      }
      for (const id of existingIds) {
        if (!currentIds.includes(id)) await itemRepo.delete(id);
      }
    });

    return this.findById(domainId) as Promise<OrderAggregate>;
  }

  async findById(domainId: string, merchantId?: string): Promise<OrderAggregate | null> {
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'items')
      .where('o.domain_id = :domainId', { domainId });
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
    if (params.status) {
      qb.andWhere('o.status = :status', { status: params.status });
    }
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

  async delete(domainId: string): Promise<void> {
    await this.orderRepo.manager.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderOrmEntity);
      const itemRepo = manager.getRepository(OrderItemOrmEntity);
      await itemRepo.delete({ order_id: domainId });
      await orderRepo.delete({ domain_id: domainId });
    });
  }
}
