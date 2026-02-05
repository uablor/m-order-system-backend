import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRoleCommand } from './delete-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const role = await this.roleRepo.findById(command.id);
    if (!role) throw new NotFoundException(`Role not found: ${command.id}`, 'ROLE_NOT_FOUND');
    await this.roleRepo.delete(command.id);
  }
}
