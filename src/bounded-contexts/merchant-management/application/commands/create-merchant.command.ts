export class CreateMerchantCommand {
  constructor(
    public readonly shopName: string,
    public readonly defaultCurrency: string,
    public readonly ownerEmail: string,
    public readonly ownerPassword: string,
    public readonly ownerFullName: string,
  ) {}
}
