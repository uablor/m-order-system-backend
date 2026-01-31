import type { NotificationAggregate } from '../aggregates/notification.aggregate';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface INotificationRepository {
  save(aggregate: NotificationAggregate): Promise<NotificationAggregate>;
  findById(id: string): Promise<NotificationAggregate | null>;
}
