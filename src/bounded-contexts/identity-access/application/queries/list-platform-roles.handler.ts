import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPlatformRolesQuery } from './list-platform-roles.query';
import {
  PLATFORM_ROLE_REPOSITORY,
  type IPlatformRoleRepository,
} from '../../domain/repositories/platform-role.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListPlatformRolesQuery)
export class ListPlatformRolesHandler
  implements IQueryHandler<ListPlatformRolesQuery>
{
  constructor(
    @Inject(PLATFORM_ROLE_REPOSITORY)
    private readonly repo: IPlatformRoleRepository,
  ) {}

  async execute(query: ListPlatformRolesQuery) {
    const { data, total } = await this.repo.findMany({
      page: query.page,
      limit: query.limit,
    });

    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);

    return {
      data: data.map((r) => ({
        id: typeof r.id === 'string' ? r.id : r.id.value,
        name: r.name,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      pagination,
    };
  }
}
