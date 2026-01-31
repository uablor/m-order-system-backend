import { ValueObject } from './value-object';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static create(amount: number, currency: string): Money {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Invalid amount');
    }
    if (!currency?.trim()) {
      throw new Error('Currency is required');
    }
    return new Money({ amount: Math.round(amount * 100) / 100, currency: currency.trim() });
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }
}
