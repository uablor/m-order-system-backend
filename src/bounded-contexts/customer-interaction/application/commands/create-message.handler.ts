import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from './create-message.command';
import {
  CUSTOMER_MESSAGE_REPOSITORY,
  type ICustomerMessageRepository,
} from '../../domain/repositories/customer-message.repository';
import { CustomerMessageAggregate } from '../../domain/aggregates/customer-message.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
  constructor(
    @Inject(CUSTOMER_MESSAGE_REPOSITORY)
    private readonly repo: ICustomerMessageRepository,
  ) {}

  async execute(command: CreateMessageCommand): Promise<CustomerMessageAggregate> {
    const aggregate = CustomerMessageAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      customerId: command.customerId,
      merchantId: command.merchantId,
      orderId: command.orderId,
      messageType: command.messageType,
      messageContent: command.messageContent,
      fileUrl: command.fileUrl,
      isRead: false,
    });
    return this.repo.save(aggregate);
  }
}
