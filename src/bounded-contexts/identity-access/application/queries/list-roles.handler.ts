import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListRolesQuery } from './list-roles.query';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';

@QueryHandler(ListRolesQuery)
export class ListRolesHandler implements IQueryHandler<ListRolesQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(query: ListRolesQuery) {
    const list = await this.roleRepo.findMany(query.merchantId);
    return list.map((r) => ({
      id: r.id.value,
      name: r.name,
      merchantId: r.merchantId,
      permissionIds: r.permissionIds,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}
