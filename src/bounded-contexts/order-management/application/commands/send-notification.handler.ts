import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendNotificationCommand } from './send-notification.command';
import {
  NOTIFICATION_REPOSITORY,
  type INotificationRepository,
} from '../../domain/repositories/notification.repository';
import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler
  implements ICommandHandler<SendNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: INotificationRepository,
  ) {}

  async execute(command: SendNotificationCommand): Promise<void> {
    const aggregate = NotificationAggregate.create({
      id: generateUuid(),
      merchantId: command.merchantId,
      recipientId: command.customerId,
      type: command.type,
      channel: command.channel,
      subject: command.title,
      body: command.body,
      sentAt: new Date(),
    });
    await this.repo.save(aggregate);
  }
}
