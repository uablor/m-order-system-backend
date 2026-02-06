import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlatformUserCommand } from './create-platform-user.command';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';
import { PlatformUserAggregate } from '../../domain/aggregates/platform-user.aggregate';
import { Email } from '../../domain/value-objects/email.vo';
import { UniqueEntityId } from '../../../../shared/domain/value-objects/unique-entity-id.vo';
import { generateUuid } from '../../../../shared/utils/uuid.util';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '../../domain/services/password-hasher.port';

@CommandHandler(CreatePlatformUserCommand)
export class CreatePlatformUserHandler
  implements ICommandHandler<CreatePlatformUserCommand>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly repo: IPlatformUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: CreatePlatformUserCommand): Promise<PlatformUserAggregate> {
    const existing = await this.repo.findByEmail(command.email);
    if (existing) {
      throw new ConflictException('Platform user with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = PlatformUserAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      email: Email.create(command.email),
      passwordHash,
      fullName: command.fullName,
      role: command.role,
      isActive: true,
    });

    return this.repo.save(user);
  }
}
