import type { RoleAggregate } from '../aggregates/role.aggregate';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  save(role: RoleAggregate): Promise<RoleAggregate>;
  findById(id: string): Promise<RoleAggregate | null>;
  findByName(name: string, merchantId?: string): Promise<RoleAggregate | null>;
  findMany(merchantId?: string): Promise<RoleAggregate[]>;
  delete(id: string): Promise<void>;
}
