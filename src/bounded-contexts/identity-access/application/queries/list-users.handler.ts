import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from './list-users.query';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: ListUsersQuery) {
    const { data, total } = await this.userRepo.findMany({
      merchantId: query.merchantId,
      page: query.page,
      limit: query.limit,
    });
    return {
      data: data.map((u) => ({
        id: u.id.value,
        email: u.email,
        fullName: u.fullName,
        merchantId: u.merchantId,
        roleId: u.roleId,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total,
    };
  }
}
