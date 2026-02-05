import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMerchantsQuery } from './list-merchants.query';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';

@QueryHandler(ListMerchantsQuery)
export class ListMerchantsHandler implements IQueryHandler<ListMerchantsQuery> {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepo: IMerchantRepository,
  ) {}

  async execute(query: ListMerchantsQuery) {
    const { data, total } = await this.merchantRepo.findMany({
      page: query.page,
      limit: query.limit,
    });
    return {
      data: data.map((m) => ({
        id: m.id.value,
        shopName: m.shopName,
        defaultCurrency: m.defaultCurrency,
        isActive: m.isActive,
        ownerUserId: m.ownerUserId,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      total,
    };
  }
}
