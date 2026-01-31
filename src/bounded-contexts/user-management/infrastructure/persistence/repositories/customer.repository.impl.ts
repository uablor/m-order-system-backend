import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ICustomerRepository } from '../../../domain/repositories/customer.repository';
import type { CustomerEntity } from '../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { customerOrmToDomain, customerDomainToOrm } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRepositoryImpl implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepo: Repository<CustomerOrmEntity>,
  ) {}

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    const orm = this.customerRepo.create(
      customerDomainToOrm(customer) as Partial<CustomerOrmEntity>,
    );
    orm.technical_id = customer.id;
    const saved = await this.customerRepo.save(orm);
    return customerOrmToDomain(saved);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const orm = await this.customerRepo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return customerOrmToDomain(orm);
  }

  async findByMerchant(merchantId: string): Promise<CustomerEntity[]> {
    const rows = await this.customerRepo.find({
      where: { technical_merchant_id: merchantId },
      order: { created_at: 'DESC' },
    });
    return rows.map((r) => customerOrmToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.customerRepo.delete({ domain_id: id });
  }
}
