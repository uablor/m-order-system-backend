import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IMerchantRepository } from '../../../domain/repositories/merchant.repository';
import type { MerchantEntity } from '../../../domain/entities/merchant.entity';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { merchantOrmToDomain, merchantDomainToOrm } from '../mappers/merchant.mapper';
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class MerchantRepositoryImpl implements IMerchantRepository {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    private readonly repo: Repository<MerchantOrmEntity>,
  ) {}

  private getRepo(): Repository<MerchantOrmEntity> {
    const em = getTransactionManager();
    return em ? em.getRepository(MerchantOrmEntity) : this.repo;
  }

  async save(merchant: MerchantEntity): Promise<MerchantEntity> {
    const repo = this.getRepo();
    const orm = repo.create(merchantDomainToOrm(merchant) as Partial<MerchantOrmEntity>);
    const saved = await repo.save(orm);
    return merchantOrmToDomain(saved);
  }

  async findById(id: string): Promise<MerchantEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return merchantOrmToDomain(orm);
  }

  async findByName(name: string): Promise<MerchantEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({ where: { shop_name: name.trim() } });
    if (!orm) return null;
    return merchantOrmToDomain(orm);
  }

  async paginate(page: number, limit: number): Promise<{ items: MerchantEntity[]; total: number }> {
    const repo = this.getRepo();
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));
    const [rows, total] = await repo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });
    return { items: rows.map(merchantOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    const repo = this.getRepo();
    await repo.delete({ domain_id: id });
  }
}
