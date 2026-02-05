/**
 * Master/bootstrap: Main Merchant for superadmin. Idempotent.
 */
import { v4 as uuid } from 'uuid';
import { DataSource } from 'typeorm';
import { MerchantOrmEntity } from '../../../../../../bounded-contexts/merchant-management/infrastructure/persistence/entities';
import { Seed } from '../types';

const MAIN_MERCHANT = {
  shopName: 'Main Merchant',
  defaultCurrency: 'LAK',
};

export const seed004Merchant: Seed = {
  name: '004-merchant',
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(MerchantOrmEntity);
    const existing = await repo.findOne({
      where: { shop_name: MAIN_MERCHANT.shopName },
    });
    if (!existing) {
      const domainId = uuid();
      await repo.save(
        repo.create({
          id: domainId,
          domain_id: domainId,
          shop_name: MAIN_MERCHANT.shopName,
          default_currency: MAIN_MERCHANT.defaultCurrency,
          is_active: true,
          owner_user_id: null,
        }),
      );
    }
  },
};
