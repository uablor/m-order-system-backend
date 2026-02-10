import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePlatformRoleCommand } from './delete-platform-role.command';
import {
  PLATFORM_ROLE_REPOSITORY,
  type IPlatformRoleRepository,
} from '../../domain/repositories/platform-role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeletePlatformRoleCommand)
export class DeletePlatformRoleHandler
  implements ICommandHandler<DeletePlatformRoleCommand>
{
  constructor(
    @Inject(PLATFORM_ROLE_REPOSITORY)
    private readonly repo: IPlatformRoleRepository,
  ) {}

  async execute(command: DeletePlatformRoleCommand): Promise<void> {
    const role = await this.repo.findById(command.id);
    if (!role) {
      throw new NotFoundException(
        `Platform role not found: ${command.id}`,
        'PLATFORM_ROLE_NOT_FOUND',
      );
    }
    await this.repo.delete(command.id);
  }
}
