import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotificationQuery } from './get-notification.query';
import {
  NOTIFICATION_REPOSITORY,
  type INotificationRepository,
} from '../../domain/repositories/notification.repository';

@QueryHandler(GetNotificationQuery)
export class GetNotificationHandler implements IQueryHandler<GetNotificationQuery> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: INotificationRepository,
  ) {}

  async execute(query: GetNotificationQuery) {
    const aggregate = await this.repo.findById(query.id);
    if (!aggregate) return null;
    return {
      id: aggregate.id.value,
      merchantId: aggregate.merchantId,
      customerId: aggregate.customerId,
      notificationType: aggregate.notificationType,
      channel: aggregate.channel,
      recipientContact: aggregate.recipientContact,
      messageContent: aggregate.messageContent,
      notificationLink: aggregate.notificationLink,
      retryCount: aggregate.retryCount,
      lastRetryAt: aggregate.lastRetryAt,
      status: aggregate.status,
      sentAt: aggregate.sentAt,
      errorMessage: aggregate.errorMessage,
      relatedOrders: aggregate.relatedOrders,
      createdAt: aggregate.createdAt,
    };
  }
}
