import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from './create-notification.command';
import {
  NOTIFICATION_REPOSITORY,
  type INotificationRepository,
} from '../../domain/repositories/notification.repository';
import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: INotificationRepository,
  ) {}

  async execute(command: CreateNotificationCommand) {
    const aggregate = NotificationAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      merchantId: command.merchantId,
      customerId: command.customerId,
      notificationType: command.notificationType,
      channel: command.channel,
      recipientContact: command.recipientContact,
      messageContent: command.messageContent,
      notificationLink: command.notificationLink,
      retryCount: 0,
      status: 'FAILED',
      relatedOrders: command.relatedOrders,
    });
    const saved = await this.repo.save(aggregate);
    return { id: saved.id.value };
  }
}
