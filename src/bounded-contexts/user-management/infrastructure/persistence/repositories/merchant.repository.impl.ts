import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IMerchantRepository } from '../../../domain/repositories/merchant.repository';
import type { MerchantEntity } from '../../../domain/entities/merchant.entity';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { merchantOrmToDomain, merchantDomainToOrm } from '../mappers/merchant.mapper';

@Injectable()
export class MerchantRepositoryImpl implements IMerchantRepository {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    private readonly merchantRepo: Repository<MerchantOrmEntity>,
  ) {}

  async save(merchant: MerchantEntity): Promise<MerchantEntity> {
    const orm = this.merchantRepo.create(
      merchantDomainToOrm(merchant) as Partial<MerchantOrmEntity>,
    );
    orm.technical_id = merchant.id;
    const saved = await this.merchantRepo.save(orm);
    return merchantOrmToDomain(saved);
  }

  async findById(id: string): Promise<MerchantEntity | null> {
    const orm = await this.merchantRepo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return merchantOrmToDomain(orm);
  }

  async findByName(name: string): Promise<MerchantEntity | null> {
    const orm = await this.merchantRepo.findOne({ where: { shop_name: name } });
    if (!orm) return null;
    return merchantOrmToDomain(orm);
  }

  async paginate(
    page: number,
    limit: number,
  ): Promise<{ items: MerchantEntity[]; total: number }> {
    const [rows, total] = await this.merchantRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: rows.map((r) => merchantOrmToDomain(r)), total };
  }

  async delete(id: string): Promise<void> {
    await this.merchantRepo.delete({ domain_id: id });
  }
}
