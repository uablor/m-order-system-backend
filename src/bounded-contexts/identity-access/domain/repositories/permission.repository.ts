import type { PermissionAggregate } from '../aggregates/permission.aggregate';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  findById(id: string): Promise<PermissionAggregate | null>;
  findByCode(code: string): Promise<PermissionAggregate | null>;
  findMany(): Promise<PermissionAggregate[]>;
}
