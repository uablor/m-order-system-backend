import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IMerchantRepository,
  MerchantRepositoryFindManyParams,
} from '../../../domain/repositories/merchant.repository';
import type { MerchantAggregate } from '../../../domain/aggregates/merchant.aggregate';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { merchantOrmToDomain, merchantDomainToOrm } from '../mappers/merchant.mapper';
import { paginateEntity } from '@shared/infrastructure/persistence/pagination';

@Injectable()
export class MerchantRepositoryImpl implements IMerchantRepository {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    private readonly repo: Repository<MerchantOrmEntity>,
  ) {}

  async save(merchant: MerchantAggregate): Promise<MerchantAggregate> {
    const orm = this.repo.create(merchantDomainToOrm(merchant) as Partial<MerchantOrmEntity>);
    orm.id = merchant.id.value;
    const saved = await this.repo.save(orm);
    return merchantOrmToDomain(saved);
  }

  async findById(id: string): Promise<MerchantAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? merchantOrmToDomain(orm) : null;
  }

  async findMany(
    params: MerchantRepositoryFindManyParams,
  ): Promise<{ data: MerchantAggregate[]; total: number }> {
    const result = await paginateEntity(this.repo, { page: params.page, limit: params.limit }, {
      order: { created_at: 'DESC' } as { created_at: 'DESC' },
    });
    return { data: result.data.map(merchantOrmToDomain), total: result.total };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
