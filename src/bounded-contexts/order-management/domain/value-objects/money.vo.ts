import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class MoneyVO extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static create(amount: number, currency: string): MoneyVO {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Invalid amount');
    }
    if (!currency?.trim()) {
      throw new Error('Currency is required');
    }
    if (amount < 0) {
      throw new Error('Amount must be non-negative');
    }
    return new MoneyVO({ amount: Math.round(amount * 100) / 100, currency: currency.trim() });
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }
}
