import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';
import { NotificationAggregate as NotificationClass } from '../../../domain/aggregates/notification.aggregate';
import type { NotificationOrmEntity } from '../entities/notification.orm-entity';

export function notificationOrmToDomain(orm: NotificationOrmEntity): NotificationAggregate {
  return NotificationClass.fromPersistence({
    id: UniqueEntityId.create(orm.notification_id),
    merchantId: orm.merchant_id,
    customerId: orm.customer_id,
    notificationType: orm.notification_type as 'ARRIVAL' | 'PAYMENT' | 'REMINDER',
    channel: orm.channel as 'FB' | 'LINE' | 'WHATSAPP',
    recipientContact: orm.recipient_contact,
    messageContent: orm.message_content,
    notificationLink: orm.notification_link ?? undefined,
    retryCount: orm.retry_count,
    lastRetryAt: orm.last_retry_at ?? undefined,
    status: (orm.status ?? 'FAILED') as 'SENT' | 'FAILED',
    sentAt: orm.sent_at ?? undefined,
    errorMessage: orm.error_message ?? undefined,
    relatedOrders: orm.related_orders ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at ?? orm.created_at,
  });
}

export function notificationDomainToOrm(
  agg: NotificationAggregate,
): Partial<NotificationOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    notification_id: id,
    merchant_id: agg.merchantId,
    customer_id: agg.customerId,
    notification_type: agg.notificationType,
    channel: agg.channel,
    recipient_contact: agg.recipientContact,
    message_content: agg.messageContent,
    notification_link: agg.notificationLink ?? null,
    retry_count: agg.retryCount,
    last_retry_at: agg.lastRetryAt ?? null,
    status: agg.status,
    sent_at: agg.sentAt ?? null,
    error_message: agg.errorMessage ?? null,
    related_orders: agg.relatedOrders ?? null,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
