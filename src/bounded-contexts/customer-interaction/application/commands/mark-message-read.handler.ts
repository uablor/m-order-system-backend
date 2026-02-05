import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkMessageReadCommand } from './mark-message-read.command';
import {
  CUSTOMER_MESSAGE_REPOSITORY,
  type ICustomerMessageRepository,
} from '../../domain/repositories/customer-message.repository';

@CommandHandler(MarkMessageReadCommand)
export class MarkMessageReadHandler implements ICommandHandler<MarkMessageReadCommand> {
  constructor(
    @Inject(CUSTOMER_MESSAGE_REPOSITORY)
    private readonly repo: ICustomerMessageRepository,
  ) {}

  async execute(command: MarkMessageReadCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.messageId);
    if (!aggregate) throw new NotFoundException('Message not found');
    aggregate.markRead();
    await this.repo.save(aggregate);
  }
}
