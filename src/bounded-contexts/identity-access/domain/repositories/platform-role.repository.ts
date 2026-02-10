import type { PlatformRoleAggregate } from '../aggregates/platform-role.aggregate';

export const PLATFORM_ROLE_REPOSITORY = Symbol('PLATFORM_ROLE_REPOSITORY');

export interface PlatformRoleRepositoryFindManyParams {
  page?: number;
  limit?: number;
}

export interface IPlatformRoleRepository {
  save(role: PlatformRoleAggregate): Promise<PlatformRoleAggregate>;
  findById(id: string): Promise<PlatformRoleAggregate | null>;
  findByName(name: string): Promise<PlatformRoleAggregate | null>;
  findMany(params?: PlatformRoleRepositoryFindManyParams): Promise<{
    data: PlatformRoleAggregate[];
    total: number;
  }>;
  delete(id: string): Promise<void>;
}
