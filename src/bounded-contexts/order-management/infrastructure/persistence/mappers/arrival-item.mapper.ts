import { UniqueEntityId } from '../../../../../shared/domain/value-objects';
import type { ArrivalItemEntity } from '../../../domain/entities/arrival-item.entity';
import { ArrivalItemEntity as ArrivalItemClass } from '../../../domain/entities/arrival-item.entity';
import type { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

export function arrivalItemOrmToDomain(orm: ArrivalItemOrmEntity): ArrivalItemEntity {
  return ArrivalItemClass.create({
    id: UniqueEntityId.create(orm.domain_id ?? orm.arrival_item_id),
    arrivalId: orm.arrival_id,
    orderItemId: orm.order_item_id,
    arrivedQuantity: orm.arrived_quantity,
    condition: (orm.condition ?? 'OK') as 'OK' | 'DAMAGED' | 'LOST',
    notes: orm.notes ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.created_at,
  });
}

export function arrivalItemDomainToOrm(
  item: ArrivalItemEntity,
  arrivalId: string,
): Partial<ArrivalItemOrmEntity> {
  const domainId = typeof item.id === 'string' ? item.id : item.id.value;
  return {
    arrival_item_id: domainId,
    domain_id: domainId,
    arrival_id: arrivalId,
    order_item_id: item.orderItemId,
    arrived_quantity: item.arrivedQuantity,
    condition: item.condition,
    notes: item.notes ?? null,
  };
}
