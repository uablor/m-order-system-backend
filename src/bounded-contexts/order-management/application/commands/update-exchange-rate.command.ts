export class UpdateExchangeRateCommand {
  constructor(
    public readonly id: string,
    public readonly payload: { rate?: number; isActive?: boolean },
  ) {}
}
