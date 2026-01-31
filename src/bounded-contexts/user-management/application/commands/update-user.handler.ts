import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher.port';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, UserEntity> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException(`User with id '${command.userId}' not found`, 'USER_NOT_FOUND');
    }
    let passwordHash = user.passwordHash;
    if (command.password) {
      passwordHash = await this.passwordHasher.hash(command.password);
    }
    const updated = UserEntity.create({
      id: user.id,
      email: user.email,
      passwordHash,
      fullName: command.fullName ?? user.fullName,
      roleId: command.roleId ?? user.roleId,
      merchantId: user.merchantId,
      isActive: command.isActive ?? user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    });
    return this.userRepository.save(updated);
  }
}
