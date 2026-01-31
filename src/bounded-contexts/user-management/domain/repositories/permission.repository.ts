import type { PermissionEntity } from '../entities/permission.entity';

export interface IPermissionRepository {
  save(permission: PermissionEntity): Promise<PermissionEntity>;
  findByCode(permissionCode: string): Promise<PermissionEntity | null>;
  findAll(): Promise<PermissionEntity[]>;
}

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');
