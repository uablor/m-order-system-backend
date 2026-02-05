import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListPermissionsQuery } from './list-permissions.query';
import { PERMISSION_REPOSITORY, type IPermissionRepository } from '../../domain/repositories/permission.repository';

@QueryHandler(ListPermissionsQuery)
export class ListPermissionsHandler implements IQueryHandler<ListPermissionsQuery> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
  ) {}

  async execute(_query: ListPermissionsQuery) {
    const list = await this.permissionRepo.findMany();
    return list.map((p) => ({
      id: p.id.value,
      code: p.code,
      name: p.name,
      description: p.description,
    }));
  }
}
