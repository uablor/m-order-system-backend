import { ValueObject } from './value-object';

interface DateRangeProps {
  from: Date;
  to: Date;
}

export class DateRange extends ValueObject<DateRangeProps> {
  private constructor(props: DateRangeProps) {
    super(props);
  }

  static create(from: Date, to: Date): DateRange {
    if (from > to) {
      throw new Error('From date must be before or equal to to date');
    }
    return new DateRange({ from, to });
  }

  get from(): Date {
    return this.props.from;
  }

  get to(): Date {
    return this.props.to;
  }
}
