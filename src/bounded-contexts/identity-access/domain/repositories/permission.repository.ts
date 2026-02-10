import type { PermissionAggregate } from '../aggregates/permission.aggregate';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  save(permission: PermissionAggregate): Promise<PermissionAggregate>;
  findById(id: string): Promise<PermissionAggregate | null>;
  findByCode(code: string): Promise<PermissionAggregate | null>;
  findMany(): Promise<PermissionAggregate[]>;
}
