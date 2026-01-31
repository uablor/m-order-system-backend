import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExchangeRateCommand } from './update-exchange-rate.command';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';
import { ExchangeRateNotFoundException } from '../../domain/exceptions/exchange-rate-not-found.exception';

@CommandHandler(UpdateExchangeRateCommand)
export class UpdateExchangeRateHandler
  implements ICommandHandler<UpdateExchangeRateCommand>
{
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(command: UpdateExchangeRateCommand): Promise<void> {
    const existing = await this.repo.findById(command.id);
    if (!existing) {
      throw new ExchangeRateNotFoundException(command.id);
    }
    existing.updateRate(command.rate);
    await this.repo.save(existing);
  }
}
