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
import { paginateEntity } from '@shared/infrastructure/persistence/pagination';

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
    const result = await paginateEntity(this.repo, { page: params.page, limit: params.limit }, {
      where: { merchant_id: params.merchantId } as object,
      order: { created_at: 'DESC' } as { created_at: 'DESC' },
    });
    return { data: result.data.map(customerOrmToDomain), total: result.total };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
