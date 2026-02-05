import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { CustomerMessageAggregate } from '../../../domain/aggregates/customer-message.aggregate';
import { CustomerMessageAggregate as CustomerMessageClass } from '../../../domain/aggregates/customer-message.aggregate';
import type { CustomerMessageOrmEntity } from '../entities/customer-message.orm-entity';

export function customerMessageOrmToDomain(
  orm: CustomerMessageOrmEntity,
): CustomerMessageAggregate {
  return CustomerMessageClass.fromPersistence({
    id: UniqueEntityId.create(orm.domain_id ?? orm.message_id),
    customerId: orm.customer_id,
    merchantId: orm.merchant_id,
    orderId: orm.order_id ?? undefined,
    messageType: (orm.message_type ?? 'TEXT') as 'TEXT' | 'IMAGE',
    messageContent: orm.message_content,
    fileUrl: orm.file_url ?? undefined,
    isRead: orm.is_read ?? false,
    readAt: orm.read_at ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function customerMessageDomainToOrm(
  agg: CustomerMessageAggregate,
): Partial<CustomerMessageOrmEntity> {
  const domainId = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    message_id: domainId,
    domain_id: domainId,
    customer_id: agg.customerId,
    merchant_id: agg.merchantId,
    order_id: agg.orderId ?? null,
    message_type: agg.messageType,
    message_content: agg.messageContent,
    file_url: agg.fileUrl ?? null,
    is_read: agg.isRead,
    read_at: agg.readAt ?? null,
  };
}
