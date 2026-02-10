import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlatformRoleCommand } from './create-platform-role.command';
import {
  PLATFORM_ROLE_REPOSITORY,
  type IPlatformRoleRepository,
} from '../../domain/repositories/platform-role.repository';
import { PlatformRoleAggregate } from '../../domain/aggregates/platform-role.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils/uuid.util';

@CommandHandler(CreatePlatformRoleCommand)
export class CreatePlatformRoleHandler
  implements ICommandHandler<CreatePlatformRoleCommand, PlatformRoleAggregate>
{
  constructor(
    @Inject(PLATFORM_ROLE_REPOSITORY)
    private readonly repo: IPlatformRoleRepository,
  ) {}

  async execute(command: CreatePlatformRoleCommand): Promise<PlatformRoleAggregate> {
    const existing = await this.repo.findByName(command.name.trim());
    if (existing) {
      throw new ConflictException(
        `Platform role with name "${command.name}" already exists`,
      );
    }

    const role = PlatformRoleAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      name: command.name.trim(),
    });

    return this.repo.save(role);
  }
}
