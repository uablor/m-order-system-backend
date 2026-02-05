import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ICustomerMessageRepository,
  CustomerMessageRepositoryFindManyParams,
} from '../../../domain/repositories/customer-message.repository';
import type { CustomerMessageAggregate } from '../../../domain/aggregates/customer-message.aggregate';
import { CustomerMessageOrmEntity } from '../entities/customer-message.orm-entity';
import {
  customerMessageOrmToDomain,
  customerMessageDomainToOrm,
} from '../mappers/customer-message.mapper';

@Injectable()
export class CustomerMessageRepositoryImpl implements ICustomerMessageRepository {
  constructor(
    @InjectRepository(CustomerMessageOrmEntity)
    private readonly repo: Repository<CustomerMessageOrmEntity>,
  ) {}

  async save(aggregate: CustomerMessageAggregate): Promise<CustomerMessageAggregate> {
    const orm = this.repo.create(
      customerMessageDomainToOrm(aggregate) as Partial<CustomerMessageOrmEntity>,
    );
    orm.message_id = aggregate.id.value;
    const saved = await this.repo.save(orm);
    return customerMessageOrmToDomain(saved);
  }

  async findById(id: string): Promise<CustomerMessageAggregate | null> {
    const orm = await this.repo.findOne({ where: { message_id: id } });
    return orm ? customerMessageOrmToDomain(orm) : null;
  }

  async findMany(params: CustomerMessageRepositoryFindManyParams): Promise<{
    data: CustomerMessageAggregate[];
    total: number;
  }> {
    const qb = this.repo
      .createQueryBuilder('m')
      .where('m.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.customerId) qb.andWhere('m.customer_id = :customerId', { customerId: params.customerId });
    if (params.orderId) qb.andWhere('m.order_id = :orderId', { orderId: params.orderId });
    qb.orderBy('m.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(customerMessageOrmToDomain), total };
  }
}
