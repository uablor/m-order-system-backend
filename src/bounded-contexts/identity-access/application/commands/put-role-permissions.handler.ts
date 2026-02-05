import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PutRolePermissionsCommand } from './put-role-permissions.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(PutRolePermissionsCommand)
export class PutRolePermissionsHandler
  implements ICommandHandler<PutRolePermissionsCommand>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(command: PutRolePermissionsCommand): Promise<void> {
    const role = await this.roleRepo.findById(command.roleId);
    if (!role)
      throw new NotFoundException(`Role not found: ${command.roleId}`, 'ROLE_NOT_FOUND');
    role.replacePermissions(command.permissionIds);
    await this.roleRepo.save(role);
  }
}
