import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeactivatePlatformUserCommand } from './deactivate-platform-user.command';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';

@CommandHandler(DeactivatePlatformUserCommand)
export class DeactivatePlatformUserHandler
  implements ICommandHandler<DeactivatePlatformUserCommand>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
  ) {}

  async execute(command: DeactivatePlatformUserCommand): Promise<void> {
    const user = await this.repo.findById(command.userId);
    if (!user) {
      throw new NotFoundException('Platform user not found');
    }

    user.deactivate();
    await this.repo.save(user);
  }
}
