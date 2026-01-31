import type { DefaultCurrency } from '../../domain/entities/merchant.entity';

export class CreateMerchantCommand {
  constructor(
    public readonly ownerUserId: string,
    public readonly shopName: string,
    public readonly defaultCurrency: DefaultCurrency,
    public readonly isActive: boolean,
    public readonly shopLogoUrl?: string,
    public readonly shopAddress?: string,
    public readonly contactPhone?: string,
    public readonly contactEmail?: string,
    public readonly contactFacebook?: string,
    public readonly contactLine?: string,
    public readonly contactWhatsapp?: string,
  ) {}
}
