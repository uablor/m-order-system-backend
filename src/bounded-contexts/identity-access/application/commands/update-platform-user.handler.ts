import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePlatformUserCommand } from './update-platform-user.command';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '../../domain/services/password-hasher.port';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdatePlatformUserCommand)
export class UpdatePlatformUserHandler
  implements ICommandHandler<UpdatePlatformUserCommand>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: UpdatePlatformUserCommand): Promise<void> {
    const user = await this.repo.findById(command.id);
    if (!user) {
      throw new NotFoundException(
        `Platform user not found: ${command.id}`,
        'PLATFORM_USER_NOT_FOUND',
      );
    }

    const p = command.payload;
    if (p.fullName != null) user.updateProfile(p.fullName);
    if (p.role != null) user.changeRole(p.role);
    if (p.isActive === false) user.deactivate();
    if (p.isActive === true) user.activate();
    if (p.password != null) {
      const newHash = await this.hasher.hash(p.password);
      user.changePassword(newHash);
    }

    await this.repo.save(user);
  }
}
