import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMerchantCommand } from './create-merchant.command';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { MerchantAggregate } from '../../domain/aggregates/merchant.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';
import { CreateUserCommand } from '../../../identity-access/application/commands/create-user.command';
import { CreateRoleCommand } from '../../../identity-access/application/commands/create-role.command';
import type { RoleAggregate } from '../../../identity-access/domain/aggregates/role.aggregate';
import type { UserAggregate } from '../../../identity-access/domain/aggregates/user.aggregate';

@CommandHandler(CreateMerchantCommand)
export class CreateMerchantHandler
  implements ICommandHandler<CreateMerchantCommand, { id: string; ownerUserId: string }>
{
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepo: IMerchantRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(
    command: CreateMerchantCommand,
  ): Promise<{ id: string; ownerUserId: string }> {
    const merchantId = generateUuid();
    const merchant = MerchantAggregate.create({
      id: UniqueEntityId.create(merchantId),
      shopName: command.shopName.trim(),
      defaultCurrency: command.defaultCurrency.trim(),
      isActive: true,
    });
    const saved = await this.merchantRepo.save(merchant);

    const ownerRole = await this.commandBus.execute<CreateRoleCommand, RoleAggregate>(
      new CreateRoleCommand('OWNER', saved.id.value, []),
    );
    const ownerRoleId = ownerRole.id.value;

    const ownerUser = await this.commandBus.execute<CreateUserCommand, UserAggregate>(
      new CreateUserCommand(
        command.ownerEmail.trim().toLowerCase(),
        command.ownerPassword,
        command.ownerFullName.trim(),
        saved.id.value,
        ownerRoleId,
      ),
    );
    const ownerUserId = ownerUser.id.value;
    saved.setOwnerUser(ownerUserId);
    await this.merchantRepo.save(saved);

    return { id: saved.id.value, ownerUserId };
  }
}
