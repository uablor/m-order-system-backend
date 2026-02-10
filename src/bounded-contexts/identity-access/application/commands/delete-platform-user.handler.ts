import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePlatformUserCommand } from './delete-platform-user.command';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeletePlatformUserCommand)
export class DeletePlatformUserHandler
  implements ICommandHandler<DeletePlatformUserCommand>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
  ) {}

  async execute(command: DeletePlatformUserCommand): Promise<void> {
    const user = await this.repo.findById(command.id);
    if (!user) {
      throw new NotFoundException(
        `Platform user not found: ${command.id}`,
        'PLATFORM_USER_NOT_FOUND',
      );
    }
    await this.repo.delete(command.id);
  }
}
