import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMerchantCommand } from './delete-merchant.command';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeleteMerchantCommand)
export class DeleteMerchantHandler implements ICommandHandler<DeleteMerchantCommand> {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepo: IMerchantRepository,
  ) {}

  async execute(command: DeleteMerchantCommand): Promise<void> {
    const merchant = await this.merchantRepo.findById(command.id);
    if (!merchant)
      throw new NotFoundException(`Merchant not found: ${command.id}`, 'MERCHANT_NOT_FOUND');
    await this.merchantRepo.delete(command.id);
  }
}
