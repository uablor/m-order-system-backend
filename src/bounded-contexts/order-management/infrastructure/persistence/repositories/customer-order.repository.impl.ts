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
    const ormOrder = this.orderRepo.create(
      customerOrderDomainToOrm(aggregate) as Partial<CustomerOrderOrmEntity>,
    );
    ormOrder.customer_order_id = coId;
    await this.orderRepo.save(ormOrder);

    const existingIds = (
      await this.itemRepo.find({
        where: { customer_order_id: coId },
        select: ['id'],
      })
    ).map((r) => r.id);
    const currentIds = aggregate.items.map((i) =>
      typeof i.id === 'string' ? i.id : i.id.value,
    );
    for (const item of aggregate.items) {
      const itemId = typeof item.id === 'string' ? item.id : item.id.value;
      const ormItem = this.itemRepo.create(
        customerOrderItemDomainToOrm(item, coId) as Partial<CustomerOrderItemOrmEntity>,
      );
      ormItem.id = itemId;
      ormItem.customer_order_id = coId;
      await this.itemRepo.save(ormItem);
    }
    for (const id of existingIds) {
      if (!currentIds.includes(id)) await this.itemRepo.delete(id);
    }

    return this.findById(coId) as Promise<CustomerOrderAggregate>;
  }

  async findById(id: string): Promise<CustomerOrderAggregate | null> {
    const orm = await this.orderRepo.findOne({
      where: { customer_order_id: id },
      relations: ['items'],
    });
    return orm ? customerOrderOrmToDomain(orm) : null;
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
    qb.orderBy('co.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(customerOrderOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    await this.itemRepo.delete({ customer_order_id: id });
    await this.orderRepo.delete(id);
  }
}
