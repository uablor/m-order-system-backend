import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExchangeRateCommand } from './update-exchange-rate.command';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';

@CommandHandler(UpdateExchangeRateCommand)
export class UpdateExchangeRateHandler implements ICommandHandler<UpdateExchangeRateCommand> {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(command: UpdateExchangeRateCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Exchange rate not found');
    if (command.payload.rate != null) aggregate.updateRate(command.payload.rate);
    if (command.payload.isActive === false) aggregate.deactivate();
    await this.repo.save(aggregate);
  }
}
