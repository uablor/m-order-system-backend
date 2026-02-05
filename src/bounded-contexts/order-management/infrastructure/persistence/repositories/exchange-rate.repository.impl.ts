import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IExchangeRateRepository,
  ExchangeRateRepositoryFindManyParams,
} from '../../../domain/repositories/exchange-rate.repository';
import type { ExchangeRateAggregate } from '../../../domain/aggregates/exchange-rate.aggregate';
import { ExchangeRateOrmEntity } from '../entities/exchange-rate.orm-entity';
import {
  exchangeRateOrmToDomain,
  exchangeRateDomainToOrm,
} from '../mappers/exchange-rate.mapper';
import { paginateEntity } from '@shared/infrastructure/persistence/pagination';

@Injectable()
export class ExchangeRateRepositoryImpl implements IExchangeRateRepository {
  constructor(
    @InjectRepository(ExchangeRateOrmEntity)
    private readonly repo: Repository<ExchangeRateOrmEntity>,
  ) {}

  async save(aggregate: ExchangeRateAggregate): Promise<ExchangeRateAggregate> {
    const orm = this.repo.create(
      exchangeRateDomainToOrm(aggregate) as Partial<ExchangeRateOrmEntity>,
    );
    const domainId = aggregate.id.value;
    orm.rate_id = domainId;
    orm.domain_id = domainId;
    const saved = await this.repo.save(orm);
    return exchangeRateOrmToDomain(saved);
  }

  async findById(domainId: string): Promise<ExchangeRateAggregate | null> {
    const orm = await this.repo.findOne({ where: { domain_id: domainId } });
    return orm ? exchangeRateOrmToDomain(orm) : null;
  }

  async findByMerchantDateCurrencyType(
    merchantId: string,
    rateDate: Date,
    baseCurrency: string,
    targetCurrency: string,
    rateType: string,
  ): Promise<ExchangeRateAggregate | null> {
    const dateStr =
      rateDate instanceof Date
        ? rateDate.toISOString().slice(0, 10)
        : String(rateDate).slice(0, 10);
    const orm = await this.repo.findOne({
      where: {
        merchant_id: merchantId,
        rate_date: new Date(dateStr + 'T00:00:00.000Z'),
        base_currency: baseCurrency,
        target_currency: targetCurrency,
        rate_type: rateType,
      },
    });
    return orm ? exchangeRateOrmToDomain(orm) : null;
  }

  async findMany(params: ExchangeRateRepositoryFindManyParams): Promise<{
    data: ExchangeRateAggregate[];
    total: number;
  }> {
    const qb = this.repo
      .createQueryBuilder('er')
      .where('er.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.fromDate) {
      qb.andWhere('er.rate_date >= :fromDate', { fromDate: params.fromDate });
    }
    if (params.toDate) {
      qb.andWhere('er.rate_date <= :toDate', { toDate: params.toDate });
    }
    qb.orderBy('er.rate_date', 'DESC').addOrderBy('er.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(exchangeRateOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
