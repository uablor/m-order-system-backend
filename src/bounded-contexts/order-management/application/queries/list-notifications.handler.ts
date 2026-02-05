import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListNotificationsQuery } from './list-notifications.query';
import {
  NOTIFICATION_REPOSITORY,
  type INotificationRepository,
} from '../../domain/repositories/notification.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListNotificationsQuery)
export class ListNotificationsHandler implements IQueryHandler<ListNotificationsQuery> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: INotificationRepository,
  ) {}

  async execute(query: ListNotificationsQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      customerId: query.customerId,
      notificationType: query.notificationType,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        merchantId: a.merchantId,
        customerId: a.customerId,
        notificationType: a.notificationType,
        channel: a.channel,
        recipientContact: a.recipientContact,
        messageContent: a.messageContent,
        retryCount: a.retryCount,
        status: a.status,
        sentAt: a.sentAt,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}
