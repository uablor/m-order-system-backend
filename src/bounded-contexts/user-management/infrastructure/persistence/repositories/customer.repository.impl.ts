import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ICustomerRepository } from '../../../domain/repositories/customer.repository';
import type { CustomerEntity } from '../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { customerOrmToDomain, customerDomainToOrm } from '../mappers/customer.mapper';
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repo: Repository<CustomerOrmEntity>,
  ) {}

  private getRepo(): Repository<CustomerOrmEntity> {
    const em = getTransactionManager();
    return em ? em.getRepository(CustomerOrmEntity) : this.repo;
  }

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    const repo = this.getRepo();
    const orm = repo.create(customerDomainToOrm(customer) as Partial<CustomerOrmEntity>);
    const saved = await repo.save(orm);
    return customerOrmToDomain(saved);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return customerOrmToDomain(orm);
  }

  async findByMerchant(merchantId: string): Promise<CustomerEntity[]> {
    const repo = this.getRepo();
    const rows = await repo.find({ where: { merchant_id: merchantId } });
    return rows.map(customerOrmToDomain);
  }

  async delete(id: string): Promise<void> {
    const repo = this.getRepo();
    await repo.delete({ domain_id: id });
  }
}
