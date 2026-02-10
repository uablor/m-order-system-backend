import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlatformRoleQuery } from './get-platform-role.query';
import {
  PLATFORM_ROLE_REPOSITORY,
  type IPlatformRoleRepository,
} from '../../domain/repositories/platform-role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetPlatformRoleQuery)
export class GetPlatformRoleHandler
  implements IQueryHandler<GetPlatformRoleQuery>
{
  constructor(
    @Inject(PLATFORM_ROLE_REPOSITORY)
    private readonly repo: IPlatformRoleRepository,
  ) {}

  async execute(query: GetPlatformRoleQuery) {
    const role = await this.repo.findById(query.id);
    if (!role) {
      throw new NotFoundException(
        `Platform role not found: ${query.id}`,
        'PLATFORM_ROLE_NOT_FOUND',
      );
    }
    return {
      id: typeof role.id === 'string' ? role.id : role.id.value,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
