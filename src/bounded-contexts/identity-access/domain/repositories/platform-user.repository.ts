import type { PlatformUserAggregate } from '../aggregates/platform-user.aggregate';

export const PLATFORM_USER_REPOSITORY = Symbol('PLATFORM_USER_REPOSITORY');

export interface PlatformUserRepositoryFindManyParams {
  page?: number;
  limit?: number;
}

export interface IPlatformUserRepository {
  save(user: PlatformUserAggregate): Promise<PlatformUserAggregate>;
  findById(id: string): Promise<PlatformUserAggregate | null>;
  findByEmail(email: string): Promise<PlatformUserAggregate | null>;
  findMany(params: PlatformUserRepositoryFindManyParams): Promise<{ data: PlatformUserAggregate[]; total: number }>;
  delete(id: string): Promise<void>;
}
