import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePlatformUserRoleCommand } from './change-platform-user-role.command';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';

@CommandHandler(ChangePlatformUserRoleCommand)
export class ChangePlatformUserRoleHandler
  implements ICommandHandler<ChangePlatformUserRoleCommand>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
  ) {}

  async execute(command: ChangePlatformUserRoleCommand): Promise<void> {
    const user = await this.repo.findById(command.userId);
    if (!user) {
      throw new NotFoundException('Platform user not found');
    }

    user.changeRole(command.newRole);
    await this.repo.save(user);
  }
}
