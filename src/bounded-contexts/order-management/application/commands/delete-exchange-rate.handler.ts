import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExchangeRateCommand } from './delete-exchange-rate.command';
import {
  EXCHANGE_RATE_REPOSITORY,
  type IExchangeRateRepository,
} from '../../domain/repositories/exchange-rate.repository';

@CommandHandler(DeleteExchangeRateCommand)
export class DeleteExchangeRateHandler implements ICommandHandler<DeleteExchangeRateCommand> {
  constructor(
    @Inject(EXCHANGE_RATE_REPOSITORY)
    private readonly repo: IExchangeRateRepository,
  ) {}

  async execute(command: DeleteExchangeRateCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Exchange rate not found');
    await this.repo.delete(command.id);
  }
}
