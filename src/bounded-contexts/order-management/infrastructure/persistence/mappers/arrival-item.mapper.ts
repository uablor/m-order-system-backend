import type { ArrivalItemEntity } from '../../../domain/entities/arrival-item.entity';
import { ArrivalItemEntity as ArrivalItemEntityClass } from '../../../domain/entities/arrival-item.entity';
import type { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

export function arrivalItemOrmToDomain(orm: ArrivalItemOrmEntity): ArrivalItemEntity {
  return ArrivalItemEntityClass.create({
    id: orm.domain_id,
    arrivalId: orm.technical_arrival_id,
    orderItemId: orm.technical_order_item_id,
    quantityReceived: Number(orm.arrived_quantity),
    condition: orm.condition,
  });
}

export function arrivalItemDomainToOrm(
  entity: ArrivalItemEntity,
): Partial<ArrivalItemOrmEntity> & { technical_arrival_id?: string } {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    technical_order_item_id: entity.orderItemId,
    arrived_quantity: entity.quantityReceived,
    condition: entity.condition,
  };
}
