import type { ArrivalAggregate } from '../../../domain/aggregates/arrival.aggregate';
import { ArrivalAggregate as ArrivalAggregateClass } from '../../../domain/aggregates/arrival.aggregate';
import type { ArrivalItemEntity } from '../../../domain/entities/arrival-item.entity';
import type { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import type { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
import { arrivalItemOrmToDomain } from './arrival-item.mapper';

export interface ArrivalMapperContext {
  merchantId?: string;
  recordedBy?: string;
}

export function arrivalOrmToDomain(
  orm: ArrivalOrmEntity,
  items: ArrivalItemOrmEntity[],
): ArrivalAggregate {
  return ArrivalAggregateClass.fromPersistence({
    id: orm.domain_id,
    orderId: orm.technical_order_id,
    arrivalDate: orm.arrived_date,
    status: 'RECEIVED',
    notes: orm.notes ?? undefined,
    items: items.map((i) => arrivalItemOrmToDomain(i)),
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function arrivalDomainToOrm(
  aggregate: ArrivalAggregate,
  context?: ArrivalMapperContext,
): Partial<ArrivalOrmEntity> {
  return {
    technical_id: aggregate.id,
    domain_id: aggregate.id,
    technical_order_id: aggregate.orderId,
    technical_merchant_id: context?.merchantId ?? '',
    arrived_date: aggregate.arrivalDate,
    technical_user_id: context?.recordedBy ?? '',
    notes: aggregate.notes ?? null,
  };
}
