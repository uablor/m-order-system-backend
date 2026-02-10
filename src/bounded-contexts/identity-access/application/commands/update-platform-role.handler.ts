import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlatformRoleCommand } from './update-platform-role.command';
import {
  PLATFORM_ROLE_REPOSITORY,
  type IPlatformRoleRepository,
} from '../../domain/repositories/platform-role.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdatePlatformRoleCommand)
export class UpdatePlatformRoleHandler
  implements ICommandHandler<UpdatePlatformRoleCommand>
{
  constructor(
    @Inject(PLATFORM_ROLE_REPOSITORY)
    private readonly repo: IPlatformRoleRepository,
  ) {}

  async execute(command: UpdatePlatformRoleCommand): Promise<void> {
    const role = await this.repo.findById(command.id);
    if (!role) {
      throw new NotFoundException(
        `Platform role not found: ${command.id}`,
        'PLATFORM_ROLE_NOT_FOUND',
      );
    }

    if (command.payload.name != null) role.updateName(command.payload.name);
    await this.repo.save(role);
  }
}
