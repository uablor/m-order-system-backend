import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginateMerchantsQuery } from './paginate-merchants.query';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import type { MerchantEntity } from '../../domain/entities/merchant.entity';

export interface PaginatedMerchantsResult {
  items: MerchantEntity[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(PaginateMerchantsQuery)
export class PaginateMerchantsHandler
  implements IQueryHandler<PaginateMerchantsQuery, PaginatedMerchantsResult>
{
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async execute(query: PaginateMerchantsQuery): Promise<PaginatedMerchantsResult> {
    const page = Math.max(1, Math.floor(query.page));
    const limit = Math.min(100, Math.max(1, Math.floor(query.limit)));
    const { items, total } = await this.merchantRepository.paginate(page, limit);
    return { items, total, page, limit };
  }
}
