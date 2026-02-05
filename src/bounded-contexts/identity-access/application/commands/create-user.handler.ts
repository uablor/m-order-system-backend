import { Inject, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER, type IPasswordHasher } from '../../domain/services/password-hasher.port';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserAggregate> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const email = command.email.trim().toLowerCase();
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await this.hasher.hash(command.password);
    const user = UserAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      email,
      passwordHash,
      fullName: command.fullName.trim(),
      merchantId: command.merchantId,
      roleId: command.roleId,
      isActive: true,
    });
    return this.userRepo.save(user);
  }
}
