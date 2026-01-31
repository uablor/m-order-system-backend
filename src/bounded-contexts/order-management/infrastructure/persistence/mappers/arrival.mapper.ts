import { ArrivalAggregate } from '../../../domain/aggregates/arrival.aggregate';
import { ArrivalItemEntity } from '../../../domain/entities/arrival-item.entity';
import type { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import type { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

export function arrivalOrmToDomain(
  orm: ArrivalOrmEntity,
  itemOrms?: ArrivalItemOrmEntity[],
): ArrivalAggregate {
  const items =
    itemOrms?.map((i) =>
      ArrivalItemEntity.create({
        id: i.domain_id,
        arrivalId: i.arrival_id,
        orderItemId: i.order_item_id,
        quantityReceived: Number(i.quantity_received),
        condition: i.condition,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
      }),
    ) ?? [];
  return ArrivalAggregate.fromPersistence({
    id: orm.domain_id,
    orderId: orm.order_id,
    arrivalDate: orm.arrival_date,
    status: orm.status,
    notes: orm.notes ?? undefined,
    items,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function arrivalDomainToOrm(
  aggregate: ArrivalAggregate,
): Partial<ArrivalOrmEntity> {
  return {
    domain_id: aggregate.id,
    order_id: aggregate.orderId,
    arrival_date: aggregate.arrivalDate,
    status: aggregate.status,
    notes: aggregate.notes ?? null,
    updated_at: aggregate.updatedAt ?? new Date(),
  };
}
