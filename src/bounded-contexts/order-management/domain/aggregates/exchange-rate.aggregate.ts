import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { RateType } from '../value-objects/rate-type.vo';

export interface ExchangeRateAggregateProps extends EntityProps {
  merchantId: string;
  baseCurrency: string;
  targetCurrency: string;
  rateType: RateType;
  rate: number;
  isActive: boolean;
  rateDate: Date;
  createdBy: string;
}

export class ExchangeRateAggregate extends AggregateRoot<ExchangeRateAggregateProps> {
  private constructor(props: ExchangeRateAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<ExchangeRateAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): ExchangeRateAggregate {
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    if (!props.baseCurrency?.trim()) throw new Error('Base currency is required');
    if (!props.targetCurrency?.trim()) throw new Error('Target currency is required');
    if (props.rateType !== 'BUY' && props.rateType !== 'SELL')
      throw new Error('Rate type must be BUY or SELL');
    if (typeof props.rate !== 'number' || props.rate <= 0)
      throw new Error('Rate must be a positive number');
    return new ExchangeRateAggregate({
      ...props,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: ExchangeRateAggregateProps): ExchangeRateAggregate {
    return new ExchangeRateAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get baseCurrency(): string {
    return this.props.baseCurrency;
  }
  get targetCurrency(): string {
    return this.props.targetCurrency;
  }
  get rateType(): RateType {
    return this.props.rateType;
  }
  get rate(): number {
    return this.props.rate;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get rateDate(): Date {
    return this.props.rateDate;
  }
  get createdBy(): string {
    return this.props.createdBy;
  }

  updateRate(rate: number): void {
    if (typeof rate !== 'number' || rate <= 0) throw new Error('Rate must be a positive number');
    (this.props as ExchangeRateAggregateProps).rate = rate;
    (this.props as ExchangeRateAggregateProps).updatedAt = new Date();
  }

  deactivate(): void {
    (this.props as ExchangeRateAggregateProps).isActive = false;
    (this.props as ExchangeRateAggregateProps).updatedAt = new Date();
  }
}
