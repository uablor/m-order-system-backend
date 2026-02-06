import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ICustomerOrderRepository,
  CustomerOrderRepositoryFindManyParams,
} from '../../../domain/repositories/customer-order.repository';
import type { CustomerOrderAggregate } from '../../../domain/aggregates/customer-order.aggregate';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import {
  customerOrderOrmToDomain,
  customerOrderDomainToOrm,
} from '../mappers/customer-order.mapper';
import { customerOrderItemDomainToOrm } from '../mappers/customer-order-item.mapper';

@Injectable()
export class CustomerOrderRepositoryImpl implements ICustomerOrderRepository {
  constructor(
    @InjectRepository(CustomerOrderOrmEntity)
    private readonly orderRepo: Repository<CustomerOrderOrmEntity>,
    @InjectRepository(CustomerOrderItemOrmEntity)
    private readonly itemRepo: Repository<CustomerOrderItemOrmEntity>,
  ) {}

  async save(aggregate: CustomerOrderAggregate): Promise<CustomerOrderAggregate> {
    const coId = aggregate.id.value;
    await this.orderRepo.manager.transaction(async (manager) => {
      const orderRepo = manager.getRepository(CustomerOrderOrmEntity);
      const itemRepo = manager.getRepository(CustomerOrderItemOrmEntity);

      const ormOrder = orderRepo.create(
        customerOrderDomainToOrm(aggregate) as Partial<CustomerOrderOrmEntity>,
      );
      ormOrder.customer_order_id = coId;
      ormOrder.domain_id = coId;
      await orderRepo.save(ormOrder);

      const existingIds = (
        await itemRepo.find({
          where: { customer_order_id: coId },
          select: ['id'],
        })
      ).map((r) => r.id);
      const currentIds = aggregate.items.map((i) =>
        typeof i.id === 'string' ? i.id : i.id.value,
      );
      for (const item of aggregate.items) {
        const itemId = typeof item.id === 'string' ? item.id : item.id.value;
        const ormItem = itemRepo.create(
          customerOrderItemDomainToOrm(item, coId) as Partial<CustomerOrderItemOrmEntity>,
        );
        ormItem.id = itemId;
        ormItem.domain_id = itemId;
        ormItem.customer_order_id = coId;
        await itemRepo.save(ormItem);
      }
      for (const id of existingIds) {
        if (!currentIds.includes(id)) await itemRepo.delete(id);
      }
    });

    return this.findById(coId) as Promise<CustomerOrderAggregate>;
  }

  async findById(id: string): Promise<CustomerOrderAggregate | null> {
    const orm = await this.orderRepo.findOne({
      where: { customer_order_id: id },
      relations: ['items'],
    });
    return orm ? customerOrderOrmToDomain(orm) : null;
  }

  async sumAllocatedQuantityForOrderItem(orderItemId: string): Promise<number> {
    const raw = await this.itemRepo
      .createQueryBuilder('i')
      .select('COALESCE(SUM(i.quantity), 0)', 'allocated')
      .where('i.order_item_id = :orderItemId', { orderItemId })
      .getRawOne<{ allocated: string | number }>();
    const v = raw?.allocated ?? 0;
    return typeof v === 'number' ? v : Number(v);
  }

  async findMany(params: CustomerOrderRepositoryFindManyParams): Promise<{
    data: CustomerOrderAggregate[];
    total: number;
  }> {
    const qb = this.orderRepo
      .createQueryBuilder('co')
      .leftJoinAndSelect('co.items', 'items')
      .where('co.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.orderId) qb.andWhere('co.order_id = :orderId', { orderId: params.orderId });
    if (params.customerId) qb.andWhere('co.customer_id = :customerId', { customerId: params.customerId });
    if (params.status) qb.andWhere('co.status = :status', { status: params.status });
    qb.orderBy('co.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(customerOrderOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    await this.orderRepo.manager.transaction(async (manager) => {
      const orderRepo = manager.getRepository(CustomerOrderOrmEntity);
      const itemRepo = manager.getRepository(CustomerOrderItemOrmEntity);
      await itemRepo.delete({ customer_order_id: id });
      await orderRepo.delete(id);
    });
  }
}
