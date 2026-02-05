import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMerchantQuery } from './get-merchant.query';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetMerchantQuery)
export class GetMerchantHandler implements IQueryHandler<GetMerchantQuery> {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepo: IMerchantRepository,
  ) {}

  async execute(query: GetMerchantQuery) {
    const merchant = await this.merchantRepo.findById(query.id);
    if (!merchant)
      throw new NotFoundException(`Merchant not found: ${query.id}`, 'MERCHANT_NOT_FOUND');
    return {
      id: merchant.id.value,
      shopName: merchant.shopName,
      defaultCurrency: merchant.defaultCurrency,
      isActive: merchant.isActive,
      ownerUserId: merchant.ownerUserId,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
    };
  }
}
