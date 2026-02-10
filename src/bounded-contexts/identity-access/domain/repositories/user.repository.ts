import type { UserAggregate } from '../aggregates/user.aggregate';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryFindManyParams {
  merchantId?: string;
  page?: number;
  limit?: number;
}

export interface IUserRepository {
  save(user: UserAggregate): Promise<UserAggregate>;
  findById(id: string): Promise<UserAggregate | null>;
  findByEmail(email: string): Promise<UserAggregate | null>;
  findMany(params: UserRepositoryFindManyParams): Promise<{ data: UserAggregate[]; total: number }>;
  delete(id: string): Promise<void>;
}
