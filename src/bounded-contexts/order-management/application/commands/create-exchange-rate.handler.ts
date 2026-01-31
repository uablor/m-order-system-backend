import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateExchangeRateCommand } from './create-exchange-rate.command';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';
import { ExchangeRateAggregate } from '../../domain/aggregates/exchange-rate.aggregate';
import { InvalidExchangeRateException } from '../../domain/exceptions/invalid-exchange-rate.exception';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateExchangeRateCommand)
export class CreateExchangeRateHandler
  implements ICommandHandler<CreateExchangeRateCommand, ExchangeRateAggregate>
{
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(command: CreateExchangeRateCommand): Promise<ExchangeRateAggregate> {
    const existing = await this.repo.findByDate(
      command.merchantId,
      command.rateDate,
      command.rateType,
      command.baseCurrency,
    );
    if (existing) {
      throw new InvalidExchangeRateException(
        'Duplicate rate for same merchant, date, type and currency',
      );
    }
    const aggregate = ExchangeRateAggregate.create({
      id: generateUuid(),
      merchantId: command.merchantId,
      baseCurrency: command.baseCurrency,
      targetCurrency: command.targetCurrency,
      rateType: command.rateType,
      rate: command.rate,
      rateDate: command.rateDate,
    });
    return this.repo.save(aggregate);
  }
}
