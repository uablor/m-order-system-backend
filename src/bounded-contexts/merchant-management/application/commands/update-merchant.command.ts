export class UpdateMerchantCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      shopName?: string;
      defaultCurrency?: string;
      isActive?: boolean;
    },
  ) {}
}
