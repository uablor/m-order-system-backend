import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface CurrencyProps {
  code: string;
}

const ALLOWED = ['THB', 'CNY', 'USD', 'LAK'] as const;

export type CurrencyCode = (typeof ALLOWED)[number];

export class CurrencyVO extends ValueObject<CurrencyProps> {
  private constructor(props: CurrencyProps) {
    super(props);
  }

  static create(code: string): CurrencyVO {
    const normalized = code?.trim().toUpperCase() ?? '';
    if (!ALLOWED.includes(normalized as CurrencyCode)) {
      throw new Error(`Invalid currency: ${code}. Allowed: ${ALLOWED.join(', ')}`);
    }
    return new CurrencyVO({ code: normalized });
  }

  get code(): string {
    return this.props.code;
  }
}
