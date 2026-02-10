import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPlatformUsersQuery } from './list-platform-users.query';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListPlatformUsersQuery)
export class ListPlatformUsersHandler
  implements IQueryHandler<ListPlatformUsersQuery>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
  ) {}

  async execute(query: ListPlatformUsersQuery) {
    const { data, total } = await this.repo.findMany({
      page: query.page,
      limit: query.limit,
    });

    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);

    return {
      data: data.map((u) => ({
        id: typeof u.id === 'string' ? u.id : u.id.value,
        email: u.email.value,
        fullName: u.fullName,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      pagination,
    };
  }
}
