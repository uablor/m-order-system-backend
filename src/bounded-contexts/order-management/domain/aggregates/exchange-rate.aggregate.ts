import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { ExchangeRateCreatedEvent } from '../events/exchange-rate-created.event';
import { ExchangeRateUpdatedEvent } from '../events/exchange-rate-updated.event';
import { InvalidExchangeRateException } from '../exceptions/invalid-exchange-rate.exception';
import { CurrencyVO } from '../value-objects/currency.vo';
import { RateTypeVO } from '../value-objects/rate-type.vo';
import { RateDateVO } from '../value-objects/rate-date.vo';

export interface ExchangeRateAggregateProps extends EntityProps {
  merchantId: string;
  baseCurrency: string;
  targetCurrency: string;
  rateType: 'BUY' | 'SELL';
  rate: number;
  rateDate: Date;
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
    if (props.rate <= 0) {
      throw new InvalidExchangeRateException('Rate must be greater than 0');
    }
    CurrencyVO.create(props.baseCurrency);
    CurrencyVO.create(props.targetCurrency);
    RateTypeVO.create(props.rateType);
    RateDateVO.create(props.rateDate);

    const agg = new ExchangeRateAggregate({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
    agg.addDomainEvent(
      new ExchangeRateCreatedEvent(
        agg.id,
        props.merchantId,
        props.baseCurrency,
        props.rateType,
        agg.createdAt,
      ),
    );
    return agg;
  }

  static fromPersistence(props: ExchangeRateAggregateProps): ExchangeRateAggregate {
    return new ExchangeRateAggregate(props);
  }

  updateRate(newRate: number): void {
    if (newRate <= 0) {
      throw new InvalidExchangeRateException('Rate must be greater than 0');
    }
    const p = this.props as ExchangeRateAggregateProps & { rate: number; updatedAt?: Date };
    p.rate = newRate;
    p.updatedAt = new Date();
    this.addDomainEvent(
      new ExchangeRateUpdatedEvent(this.id, this.merchantId, newRate, new Date()),
    );
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
  get rateType(): 'BUY' | 'SELL' {
    return this.props.rateType;
  }
  get rate(): number {
    return this.props.rate;
  }
  get rateDate(): Date {
    return this.props.rateDate;
  }
}
