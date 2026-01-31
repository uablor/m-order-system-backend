import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMerchantQuery } from './get-merchant.query';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import type { MerchantEntity } from '../../domain/entities/merchant.entity';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetMerchantQuery)
export class GetMerchantHandler implements IQueryHandler<GetMerchantQuery, MerchantEntity> {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async execute(query: GetMerchantQuery): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findById(query.merchantId);
    if (!merchant) {
      throw new NotFoundException(`Merchant not found: ${query.merchantId}`, 'MERCHANT_NOT_FOUND');
    }
    return merchant;
  }
}
