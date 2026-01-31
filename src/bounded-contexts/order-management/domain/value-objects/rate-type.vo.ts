import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface RateTypeProps {
  value: 'BUY' | 'SELL';
}

export class RateTypeVO extends ValueObject<RateTypeProps> {
  private constructor(props: RateTypeProps) {
    super(props);
  }

  static buy(): RateTypeVO {
    return new RateTypeVO({ value: 'BUY' });
  }

  static sell(): RateTypeVO {
    return new RateTypeVO({ value: 'SELL' });
  }

  static create(value: string): RateTypeVO {
    const v = value?.trim().toUpperCase();
    if (v !== 'BUY' && v !== 'SELL') {
      throw new Error('Invalid rate type. Allowed: BUY, SELL');
    }
    return new RateTypeVO({ value: v });
  }

  get value(): 'BUY' | 'SELL' {
    return this.props.value;
  }
}
