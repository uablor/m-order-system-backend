import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoleQuery } from './get-role.query';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetRoleQuery)
export class GetRoleHandler implements IQueryHandler<GetRoleQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(query: GetRoleQuery) {
    const role = await this.roleRepo.findById(query.id);
    if (!role) throw new NotFoundException(`Role not found: ${query.id}`, 'ROLE_NOT_FOUND');
    return {
      id: role.id.value,
      name: role.name,
      merchantId: role.merchantId,
      permissionIds: role.permissionIds,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
