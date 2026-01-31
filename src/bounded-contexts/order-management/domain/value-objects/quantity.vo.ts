import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface QuantityProps {
  value: number;
}

export class QuantityVO extends ValueObject<QuantityProps> {
  private constructor(props: QuantityProps) {
    super(props);
  }

  static create(value: number): QuantityVO {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid quantity');
    }
    if (value < 0) {
      throw new Error('Quantity must be non-negative');
    }
    return new QuantityVO({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
