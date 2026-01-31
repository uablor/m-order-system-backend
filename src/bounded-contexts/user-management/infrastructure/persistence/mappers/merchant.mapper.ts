import type { MerchantEntity } from '../../../domain/entities/merchant.entity';
import { MerchantEntity as MerchantEntityClass } from '../../../domain/entities/merchant.entity';
import type { MerchantOrmEntity } from '../entities/merchant.orm-entity';

export function merchantOrmToDomain(orm: MerchantOrmEntity): MerchantEntity {
  return MerchantEntityClass.create({
    id: orm.domain_id,
    ownerUserId: orm.technical_user_id,
    shopName: orm.shop_name,
    shopLogoUrl: orm.shop_logo_url ?? undefined,
    shopAddress: orm.shop_address ?? undefined,
    contactPhone: orm.contact_phone ?? undefined,
    contactEmail: orm.contact_email ?? undefined,
    contactFacebook: orm.contact_facebook ?? undefined,
    contactLine: orm.contact_line ?? undefined,
    contactWhatsapp: orm.contact_whatsapp ?? undefined,
    defaultCurrency: orm.default_currency as MerchantEntity['defaultCurrency'],
    isActive: orm.is_active,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function merchantDomainToOrm(entity: MerchantEntity): Partial<MerchantOrmEntity> {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    technical_user_id: entity.ownerUserId,
    shop_name: entity.shopName,
    shop_logo_url: entity.shopLogoUrl ?? null,
    shop_address: entity.shopAddress ?? null,
    contact_phone: entity.contactPhone ?? null,
    contact_email: entity.contactEmail ?? null,
    contact_facebook: entity.contactFacebook ?? null,
    contact_line: entity.contactLine ?? null,
    contact_whatsapp: entity.contactWhatsapp ?? null,
    default_currency: entity.defaultCurrency,
    is_active: entity.isActive,
  };
}
