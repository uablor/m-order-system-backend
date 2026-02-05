import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateExchangeRateCommand } from './create-exchange-rate.command';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';
import { ExchangeRateAggregate } from '../../domain/aggregates/exchange-rate.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateExchangeRateCommand)
export class CreateExchangeRateHandler implements ICommandHandler<CreateExchangeRateCommand> {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(command: CreateExchangeRateCommand): Promise<ExchangeRateAggregate> {
    const rateDate = new Date(command.rateDate);
    const existing = await this.repo.findByMerchantDateCurrencyType(
      command.merchantId,
      rateDate,
      command.baseCurrency,
      command.targetCurrency,
      command.rateType,
    );
    if (existing) {
      throw new ConflictException(
        'Exchange rate already exists for this merchant, date, currency pair and type',
      );
    }
    const aggregate = ExchangeRateAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      merchantId: command.merchantId,
      baseCurrency: command.baseCurrency,
      targetCurrency: command.targetCurrency,
      rateType: command.rateType,
      rate: command.rate,
      isActive: command.isActive ?? true,
      rateDate,
      createdBy: command.createdBy,
    });
    return this.repo.save(aggregate);
  }
}
