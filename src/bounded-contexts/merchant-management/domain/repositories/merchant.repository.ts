import type { MerchantAggregate } from '../aggregates/merchant.aggregate';

export const MERCHANT_REPOSITORY = Symbol('MERCHANT_REPOSITORY');

export interface MerchantRepositoryFindManyParams {
  page?: number;
  limit?: number;
}

export interface IMerchantRepository {
  save(merchant: MerchantAggregate): Promise<MerchantAggregate>;
  findById(id: string): Promise<MerchantAggregate | null>;
  findMany(params: MerchantRepositoryFindManyParams): Promise<{
    data: MerchantAggregate[];
    total: number;
  }>;
  delete(id: string): Promise<void>;
}
