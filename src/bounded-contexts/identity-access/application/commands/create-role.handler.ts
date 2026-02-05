import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from './create-role.command';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';
import { RoleAggregate } from '../../domain/aggregates/role.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand, RoleAggregate> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<RoleAggregate> {
    const role = RoleAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      name: command.name.trim(),
      merchantId: command.merchantId ?? null,
      permissionIds: command.permissionIds ?? [],
    });
    return this.roleRepo.save(role);
  }
}
