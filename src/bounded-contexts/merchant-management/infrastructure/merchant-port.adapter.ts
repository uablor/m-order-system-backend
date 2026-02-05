import { Inject, Injectable } from '@nestjs/common';
import type { MerchantPort } from '../../identity-access/domain/services/merchant.port';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../domain/repositories/merchant.repository';

@Injectable()
export class MerchantPortAdapter implements MerchantPort {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepo: IMerchantRepository,
  ) {}

  async isActive(merchantId: string): Promise<boolean> {
    const merchant = await this.merchantRepo.findById(merchantId);
    return merchant?.isActive ?? false;
  }
}
