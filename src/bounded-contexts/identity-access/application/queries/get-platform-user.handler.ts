import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPlatformUserQuery } from './get-platform-user.query';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetPlatformUserQuery)
export class GetPlatformUserHandler
  implements IQueryHandler<GetPlatformUserQuery>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
  ) {}

  async execute(query: GetPlatformUserQuery) {
    const user = await this.repo.findById(query.id);
    if (!user) {
      throw new NotFoundException(
        `Platform user not found: ${query.id}`,
        'PLATFORM_USER_NOT_FOUND',
      );
    }
    const id = typeof user.id === 'string' ? user.id : user.id.value;
    return {
      id,
      email: user.email.value,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
