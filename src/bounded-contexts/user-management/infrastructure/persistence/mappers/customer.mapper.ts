import type { CustomerEntity } from '../../../domain/entities/customer.entity';
import { CustomerEntity as CustomerEntityClass } from '../../../domain/entities/customer.entity';
import type { CustomerOrmEntity } from '../entities/customer.orm-entity';

export function customerOrmToDomain(orm: CustomerOrmEntity): CustomerEntity {
  return CustomerEntityClass.create({
    id: orm.domain_id,
    merchantId: orm.technical_merchant_id,
    name: orm.customer_name,
    phone: orm.contact_phone ?? undefined,
    email: undefined,
    address: orm.shipping_address ?? undefined,
    createdAt: orm.created_at,
    updatedAt: orm.updated_at,
  });
}

export function customerDomainToOrm(entity: CustomerEntity): Partial<CustomerOrmEntity> {
  return {
    technical_id: entity.id,
    domain_id: entity.id,
    technical_merchant_id: entity.merchantId,
    customer_name: entity.name,
    contact_phone: entity.phone ?? null,
    shipping_address: entity.address ?? null,
  };
}
