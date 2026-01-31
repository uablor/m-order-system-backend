import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ICustomerOrderRepository,
  CustomerOrderRepositoryFindManyParams,
} from '../../../domain/repositories/customer-order.repository';
import type { CustomerOrderAggregate } from '../../../domain/aggregates/customer-order.aggregate';
import { CustomerOrmEntity } from '../../../../user-management/infrastructure/persistence/entities/customer.orm-entity';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import {
  customerOrderOrmToDomain,
  customerOrderDomainToOrm,
} from '../mappers/customer-order.mapper';
import { customerOrderItemDomainToOrm } from '../mappers/customer-order-item.mapper';
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

    await itemRepo.delete({ technical_customer_order_id: saved.technical_id });
    for (const item of aggregate.items) {
      const itemOrm = itemRepo.create(
        customerOrderItemDomainToOrm(item, saved.technical_id) as Partial<CustomerOrderItemOrmEntity>,
      );
      await itemRepo.save(itemOrm);
    }

    const items = await itemRepo.find({ where: { technical_customer_order_id: saved.technical_id } });
    return customerOrderOrmToDomain(saved, items);
  }

  async findById(id: string): Promise<CustomerOrderAggregate | null> {
    const { orderRepo, itemRepo } = this.getRepos();
    const orm = await orderRepo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    const items = await itemRepo.find({ where: { technical_customer_order_id: orm.technical_id } });
    return customerOrderOrmToDomain(orm, items);
  }

  async findMany(
    params: CustomerOrderRepositoryFindManyParams,
  ): Promise<{ data: CustomerOrderAggregate[]; total: number }> {
    const { orderRepo, itemRepo } = this.getRepos();
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const qb = orderRepo
      .createQueryBuilder('c')
      .innerJoin(CustomerOrmEntity, 'cust', 'cust.technical_id = c.technical_customer_id')
      .where('cust.technical_merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.customerId) {
      qb.andWhere('c.technical_customer_id = :customerId', { customerId: params.customerId });
    }
    qb.orderBy('c.created_at', 'DESC');
    const [rows, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data: CustomerOrderAggregate[] = [];
    for (const row of rows) {
      const items = await itemRepo.find({ where: { technical_customer_order_id: row.technical_id } });
      data.push(customerOrderOrmToDomain(row, items));
    }
    return { data, total };
  }
}
