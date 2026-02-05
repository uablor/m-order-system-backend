import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from './update-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<void> {
    const role = await this.roleRepo.findById(command.id);
    if (!role) throw new NotFoundException(`Role not found: ${command.id}`, 'ROLE_NOT_FOUND');

    if (command.payload.name != null) role.updateName(command.payload.name);
    if (command.payload.merchantId !== undefined) role.setMerchantId(command.payload.merchantId);
    if (command.payload.permissionIds != null) role.replacePermissions(command.payload.permissionIds);
    await this.roleRepo.save(role);
  }
}
