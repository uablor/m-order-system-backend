import type { RoleEntity } from '../entities/role.entity';

export interface IRoleRepository {
  save(role: RoleEntity): Promise<RoleEntity>;
  findById(id: string): Promise<RoleEntity | null>;
  findByName(roleName: string): Promise<RoleEntity | null>;
  findByIdWithPermissions(id: string): Promise<RoleEntity | null>;
  assignPermissions(roleId: string, permissionIds: string[]): Promise<void>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
