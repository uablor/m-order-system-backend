import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher.port';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { EmailAlreadyExistsException } from '../../domain/exceptions';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserEntity> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const emailVo = Email.create(command.email);
    const existing = await this.userRepository.findByEmail(emailVo.value);
    if (existing) {
      throw new EmailAlreadyExistsException(emailVo.value);
    }
    const passwordHash = await this.passwordHasher.hash(command.password);
    const user = UserEntity.create({
      id: generateUuid(),
      email: emailVo.value,
      passwordHash,
      fullName: command.fullName.trim(),
      roleId: command.roleId,
      merchantId: command.merchantId,
      isActive: true,
    });
    return this.userRepository.save(user);
  }
}
