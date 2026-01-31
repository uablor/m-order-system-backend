import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface RateDateProps {
  value: Date;
}

export class RateDateVO extends ValueObject<RateDateProps> {
  private constructor(props: RateDateProps) {
    super(props);
  }

  static create(value: Date | string): RateDateVO {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid rate date');
    }
    return new RateDateVO({ value: d });
  }

  get value(): Date {
    return this.props.value;
  }

  toDateString(): string {
    return this.props.value.toISOString().slice(0, 10);
  }
}
