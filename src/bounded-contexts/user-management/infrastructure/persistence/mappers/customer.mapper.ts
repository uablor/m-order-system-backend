import type { CustomerEntity } from '../../../domain/entities/customer.entity';
import { CustomerEntity as CustomerEntityClass } from '../../../domain/entities/customer.entity';
import type { CustomerOrmEntity } from '../entities/customer.orm-entity';

export function customerOrmToDomain(orm: CustomerOrmEntity): CustomerEntity {
  return CustomerEntityClass.create({
    id: orm.domain_id,
    merchantId: orm.merchant_id,
    name: orm.name,
    phone: orm.phone ?? undefined,
    email: orm.email ?? undefined,
    address: orm.address ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function customerDomainToOrm(entity: CustomerEntity): Partial<CustomerOrmEntity> {
  return {
    domain_id: entity.id,
    merchant_id: entity.merchantId,
    name: entity.name,
    phone: entity.phone ?? null,
    email: entity.email ?? null,
    address: entity.address ?? null,
    updated_at: entity.updatedAt ?? new Date(),
  };
}
