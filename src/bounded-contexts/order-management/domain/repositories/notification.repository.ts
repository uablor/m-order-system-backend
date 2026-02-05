import type { NotificationAggregate } from '../aggregates/notification.aggregate';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface NotificationRepositoryFindManyParams {
  merchantId: string;
  customerId?: string;
  notificationType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface INotificationRepository {
  save(aggregate: NotificationAggregate): Promise<NotificationAggregate>;
  findById(id: string): Promise<NotificationAggregate | null>;
  findMany(params: NotificationRepositoryFindManyParams): Promise<{
    data: NotificationAggregate[];
    total: number;
  }>;
}
