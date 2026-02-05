import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER, type IPasswordHasher } from '../../domain/services/password-hasher.port';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const user = await this.userRepo.findById(command.id);
    if (!user) throw new NotFoundException(`User not found: ${command.id}`, 'USER_NOT_FOUND');

    if (command.payload.fullName != null) user.updateProfile(command.payload.fullName);
    if (command.payload.roleId != null) user.assignRole(command.payload.roleId);
    if (command.payload.isActive === false) user.deactivate();
    if (command.payload.isActive === true) user.activate();
    if (command.payload.password != null) {
      const newHash = await this.hasher.hash(command.payload.password);
      user.changePassword(newHash);
    }
    await this.userRepo.save(user);
  }
}
