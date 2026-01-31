import { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';
import type { NotificationOrmEntity } from '../entities/notification.orm-entity';

export function notificationOrmToDomain(orm: NotificationOrmEntity): NotificationAggregate {
  return NotificationAggregate.fromPersistence({
    id: orm.domain_id,
    merchantId: orm.merchant_id,
    recipientId: orm.recipient_id,
    type: orm.type,
    channel: orm.channel,
    subject: orm.subject,
    body: orm.body,
    sentAt: orm.sent_at,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function notificationDomainToOrm(
  aggregate: NotificationAggregate,
): Partial<NotificationOrmEntity> {
  return {
    domain_id: aggregate.id,
    merchant_id: aggregate.merchantId,
    recipient_id: aggregate.recipientId,
    type: aggregate.type,
    channel: aggregate.channel,
    subject: aggregate.subject,
    body: aggregate.body,
    sent_at: aggregate.sentAt,
    updated_at: aggregate.updatedAt ?? new Date(),
  };
}
