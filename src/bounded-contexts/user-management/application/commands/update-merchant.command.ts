import type { DefaultCurrency } from '../../domain/entities/merchant.entity';

export class UpdateMerchantCommand {
  constructor(
    public readonly merchantId: string,
    public readonly patch: {
      ownerUserId?: string;
      shopName?: string;
      shopLogoUrl?: string;
      shopAddress?: string;
      contactPhone?: string;
      contactEmail?: string;
      contactFacebook?: string;
      contactLine?: string;
      contactWhatsapp?: string;
      defaultCurrency?: DefaultCurrency;
      isActive?: boolean;
    },
  ) {}
}
