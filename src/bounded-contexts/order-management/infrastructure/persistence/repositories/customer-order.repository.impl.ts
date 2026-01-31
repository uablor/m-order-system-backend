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
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class CustomerOrderRepositoryImpl implements ICustomerOrderRepository {
  constructor(
    @InjectRepository(CustomerOrderOrmEntity)
    private readonly orderRepo: Repository<CustomerOrderOrmEntity>,
    @InjectRepository(CustomerOrderItemOrmEntity)
    private readonly itemRepo: Repository<CustomerOrderItemOrmEntity>,
  ) {}

  private getRepos(): {
    orderRepo: Repository<CustomerOrderOrmEntity>;
    itemRepo: Repository<CustomerOrderItemOrmEntity>;
  } {
    const em = getTransactionManager();
    if (em) {
      return {
        orderRepo: em.getRepository(CustomerOrderOrmEntity),
        itemRepo: em.getRepository(CustomerOrderItemOrmEntity),
      };
    }
    return { orderRepo: this.orderRepo, itemRepo: this.itemRepo };
  }

  async save(aggregate: CustomerOrderAggregate): Promise<CustomerOrderAggregate> {
    const { orderRepo, itemRepo } = this.getRepos();
    const orm = orderRepo.create(
      customerOrderDomainToOrm(aggregate) as Partial<CustomerOrderOrmEntity>,
    );
    const saved = await orderRepo.save(orm);

    await itemRepo.delete({ customer_order_id: saved.domain_id });
    for (const item of aggregate.items) {
      const itemOrm = itemRepo.create({
        domain_id: item.id,
        customer_order_id: saved.domain_id,
        product_ref: item.productRef,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        currency: item.currency,
      });
      await itemRepo.save(itemOrm);
    }

    const items = await itemRepo.find({ where: { customer_order_id: saved.domain_id } });
    return customerOrderOrmToDomain(saved, items);
  }

  async findById(id: string): Promise<CustomerOrderAggregate | null> {
    const { orderRepo, itemRepo } = this.getRepos();
    const orm = await orderRepo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    const items = await itemRepo.find({ where: { customer_order_id: id } });
    return customerOrderOrmToDomain(orm, items);
  }

  async findMany(
    params: CustomerOrderRepositoryFindManyParams,
  ): Promise<{ data: CustomerOrderAggregate[]; total: number }> {
    const { orderRepo, itemRepo } = this.getRepos();
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const qb = orderRepo.createQueryBuilder('c').where('c.merchant_id = :merchantId', {
      merchantId: params.merchantId,
    });
    if (params.customerId) {
      qb.andWhere('c.customer_id = :customerId', { customerId: params.customerId });
    }
    qb.orderBy('c.order_date', 'DESC');
    const [rows, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data: CustomerOrderAggregate[] = [];
    for (const row of rows) {
      const items = await itemRepo.find({ where: { customer_order_id: row.domain_id } });
      data.push(customerOrderOrmToDomain(row, items));
    }
    return { data, total };
  }
}
