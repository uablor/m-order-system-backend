import type { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';
import { NotificationAggregate as NotificationAggregateClass } from '../../../domain/aggregates/notification.aggregate';
import type { NotificationOrmEntity } from '../entities/notification.orm-entity';

export function notificationOrmToDomain(orm: NotificationOrmEntity): NotificationAggregate {
  return NotificationAggregateClass.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.technical_merchant_id,
    recipientId: orm.technical_customer_id,
    type: orm.notification_type,
    channel: orm.channel,
    subject: '',
    body: orm.message_content,
    sentAt: orm.sent_at ?? orm.created_at,
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function notificationDomainToOrm(
  aggregate: NotificationAggregate,
): Partial<NotificationOrmEntity> {
  return {
    technical_id: aggregate.id,
    domain_id: aggregate.id,
    technical_merchant_id: aggregate.merchantId,
    technical_customer_id: aggregate.recipientId,
    notification_type: aggregate.type,
    channel: aggregate.channel,
    message_content: aggregate.body,
    sent_at: aggregate.sentAt,
    status: 'SENT',
  };
}
