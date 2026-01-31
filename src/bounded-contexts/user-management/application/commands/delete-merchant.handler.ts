import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMerchantCommand } from './delete-merchant.command';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeleteMerchantCommand)
export class DeleteMerchantHandler implements ICommandHandler<DeleteMerchantCommand, void> {
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async execute(command: DeleteMerchantCommand): Promise<void> {
    const existing = await this.merchantRepository.findById(command.merchantId);
    if (!existing) {
      throw new NotFoundException(`Merchant not found: ${command.merchantId}`, 'MERCHANT_NOT_FOUND');
    }
    await this.merchantRepository.delete(command.merchantId);
  }
}
