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
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class ExchangeRateRepositoryImpl implements IExchangeRateRepository {
  constructor(
    @InjectRepository(ExchangeRateOrmEntity)
    private readonly repo: Repository<ExchangeRateOrmEntity>,
  ) {}

  private getRepo(): Repository<ExchangeRateOrmEntity> {
    const em = getTransactionManager();
    return em ? em.getRepository(ExchangeRateOrmEntity) : this.repo;
  }

  async save(aggregate: ExchangeRateAggregate): Promise<ExchangeRateAggregate> {
    const repo = this.getRepo();
    const orm = repo.create(
      exchangeRateDomainToOrm(aggregate) as Partial<ExchangeRateOrmEntity>,
    );
    const saved = await repo.save(orm);
    return exchangeRateOrmToDomain(saved);
  }

  async findById(id: string): Promise<ExchangeRateAggregate | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return exchangeRateOrmToDomain(orm);
  }

  async findByDate(
    merchantId: string,
    rateDate: Date,
    rateType: 'BUY' | 'SELL',
    baseCurrency: string,
  ): Promise<ExchangeRateAggregate | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({
      where: {
        merchant_id: merchantId,
        rate_date: rateDate,
        rate_type: rateType,
        base_currency: baseCurrency,
      },
    });
    if (!orm) return null;
    return exchangeRateOrmToDomain(orm);
  }

  async findMany(
    params: ExchangeRateRepositoryFindManyParams,
  ): Promise<{ data: ExchangeRateAggregate[]; total: number }> {
    const repo = this.getRepo();
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const qb = repo.createQueryBuilder('e').where('e.merchant_id = :merchantId', {
      merchantId: params.merchantId,
    });
    if (params.rateDate) {
      qb.andWhere('e.rate_date = :rateDate', { rateDate: params.rateDate });
    }
    if (params.rateType) {
      qb.andWhere('e.rate_type = :rateType', { rateType: params.rateType });
    }
    if (params.baseCurrency) {
      qb.andWhere('e.base_currency = :baseCurrency', {
        baseCurrency: params.baseCurrency,
      });
    }
    qb.orderBy('e.rate_date', 'DESC');
    const [rows, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data: rows.map(exchangeRateOrmToDomain), total };
  }
}
