import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ICustomerRepository,
  CustomerRepositoryFindManyParams,
} from '../../../domain/repositories/customer.repository';
import type { CustomerAggregate } from '../../../domain/aggregates/customer.aggregate';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { customerOrmToDomain, customerDomainToOrm } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repo: Repository<CustomerOrmEntity>,
  ) {}

  async save(customer: CustomerAggregate): Promise<CustomerAggregate> {
    const orm = this.repo.create(customerDomainToOrm(customer) as Partial<CustomerOrmEntity>);
    orm.id = customer.id.value;
    const saved = await this.repo.save(orm);
    return customerOrmToDomain(saved);
  }

  async findById(id: string): Promise<CustomerAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? customerOrmToDomain(orm) : null;
  }

  async findByToken(token: string, merchantId?: string): Promise<CustomerAggregate | null> {
    const qb = this.repo.createQueryBuilder('c').where('c.token = :token', { token });
    if (merchantId) qb.andWhere('c.merchant_id = :merchantId', { merchantId });
    const orm = await qb.getOne();
    return orm ? customerOrmToDomain(orm) : null;
  }

  async findMany(
    params: CustomerRepositoryFindManyParams,
  ): Promise<{ data: CustomerAggregate[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const [rows, total] = await this.repo.findAndCount({
      where: { merchant_id: params.merchantId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: rows.map(customerOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
