import { ValueObject } from './value-object';

interface CurrencyProps {
  code: string;
}

const ALLOWED_CURRENCIES = ['USD', 'KHR', 'THB', 'LAK'];

export class Currency extends ValueObject<CurrencyProps> {
  private constructor(props: CurrencyProps) {
    super(props);
  }

  static create(code: string): Currency {
    const normalized = code?.trim().toUpperCase() ?? '';
    if (!ALLOWED_CURRENCIES.includes(normalized)) {
      throw new Error(`Invalid currency: ${code}`);
    }
    return new Currency({ code: normalized });
  }

  get code(): string {
    return this.props.code;
  }
}
