export class UpdateExchangeRateCommand {
  constructor(
    public readonly id: string,
    public readonly rate: number,
  ) {}
}
