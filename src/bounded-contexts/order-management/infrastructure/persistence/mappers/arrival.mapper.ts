import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { ArrivalAggregate } from '../../../domain/aggregates/arrival.aggregate';
import { ArrivalAggregate as ArrivalClass } from '../../../domain/aggregates/arrival.aggregate';
import type { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { arrivalItemOrmToDomain } from './arrival-item.mapper';

export function arrivalOrmToDomain(orm: ArrivalOrmEntity): ArrivalAggregate {
  const items = (orm.items ?? []).map(arrivalItemOrmToDomain);
  return ArrivalClass.fromPersistence({
    id: UniqueEntityId.create(orm.arrival_id),
    orderId: orm.order_id,
    merchantId: orm.merchant_id,
    arrivedDate: orm.arrived_date instanceof Date ? orm.arrived_date : new Date(orm.arrived_date),
    arrivedTime: orm.arrived_time ?? undefined,
    recordedBy: orm.recorded_by,
    notes: orm.notes ?? undefined,
    status: (orm.status ?? 'PENDING') as 'PENDING' | 'CONFIRMED',
    items,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function arrivalDomainToOrm(agg: ArrivalAggregate): Partial<ArrivalOrmEntity> {
  const id = typeof agg.id === 'string' ? agg.id : agg.id.value;
  return {
    arrival_id: id,
    order_id: agg.orderId,
    merchant_id: agg.merchantId,
    arrived_date: agg.arrivedDate,
    arrived_time: agg.arrivedTime ?? null,
    recorded_by: agg.recordedBy,
    notes: agg.notes ?? null,
    status: agg.status,
    updated_at: agg.updatedAt ?? new Date(),
  };
}
