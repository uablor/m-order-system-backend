import type { MerchantEntity } from '../entities/merchant.entity';

export interface IMerchantRepository {
  save(merchant: MerchantEntity): Promise<MerchantEntity>;
  findById(id: string): Promise<MerchantEntity | null>;
  findByName(name: string): Promise<MerchantEntity | null>;
  paginate(page: number, limit: number): Promise<{ items: MerchantEntity[]; total: number }>;
  delete(id: string): Promise<void>;
}

export const MERCHANT_REPOSITORY = Symbol('MERCHANT_REPOSITORY');
