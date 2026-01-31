import { ArrivalItemEntity } from '../../../domain/entities/arrival-item.entity';
import type { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

export function arrivalItemOrmToDomain(orm: ArrivalItemOrmEntity): ArrivalItemEntity {
  return ArrivalItemEntity.create({
    id: orm.domain_id,
    arrivalId: orm.arrival_id,
    orderItemId: orm.order_item_id,
    quantityReceived: Number(orm.quantity_received),
    condition: orm.condition,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function arrivalItemDomainToOrm(
  entity: ArrivalItemEntity,
): Partial<ArrivalItemOrmEntity> & { arrival_id?: string } {
  return {
    domain_id: entity.id,
    arrival_id: entity.arrivalId,
    order_item_id: entity.orderItemId,
    quantity_received: entity.quantityReceived,
    condition: entity.condition,
    updated_at: entity.updatedAt ?? new Date(),
  };
}
