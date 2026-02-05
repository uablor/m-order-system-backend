import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMerchantCommand } from './update-merchant.command';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdateMerchantCommand)
export class UpdateMerchantHandler implements ICommandHandler<UpdateMerchantCommand> {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepo: IMerchantRepository,
  ) {}

  async execute(command: UpdateMerchantCommand): Promise<void> {
    const merchant = await this.merchantRepo.findById(command.id);
    if (!merchant)
      throw new NotFoundException(`Merchant not found: ${command.id}`, 'MERCHANT_NOT_FOUND');
    if (command.payload.shopName != null || command.payload.defaultCurrency != null)
      merchant.updateProfile(
        command.payload.shopName ?? merchant.shopName,
        command.payload.defaultCurrency ?? merchant.defaultCurrency,
      );
    if (command.payload.isActive === false) merchant.deactivate();
    if (command.payload.isActive === true) merchant.activate();
    await this.merchantRepo.save(merchant);
  }
}
