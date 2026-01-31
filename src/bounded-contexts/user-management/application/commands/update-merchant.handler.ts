import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMerchantCommand } from './update-merchant.command';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { MerchantEntity } from '../../domain/entities/merchant.entity';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdateMerchantCommand)
export class UpdateMerchantHandler
  implements ICommandHandler<UpdateMerchantCommand, MerchantEntity>
{
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async execute(command: UpdateMerchantCommand): Promise<MerchantEntity> {
    const existing = await this.merchantRepository.findById(command.merchantId);
    if (!existing) {
      throw new NotFoundException(`Merchant not found: ${command.merchantId}`, 'MERCHANT_NOT_FOUND');
    }
    const patch = command.patch;
    const updated = MerchantEntity.create({
      id: existing.id,
      ownerUserId: patch.ownerUserId ?? existing.ownerUserId,
      shopName: patch.shopName?.trim() ?? existing.shopName,
      shopLogoUrl: patch.shopLogoUrl?.trim() ?? existing.shopLogoUrl,
      shopAddress: patch.shopAddress?.trim() ?? existing.shopAddress,
      contactPhone: patch.contactPhone?.trim() ?? existing.contactPhone,
      contactEmail: patch.contactEmail?.trim() ?? existing.contactEmail,
      contactFacebook: patch.contactFacebook?.trim() ?? existing.contactFacebook,
      contactLine: patch.contactLine?.trim() ?? existing.contactLine,
      contactWhatsapp: patch.contactWhatsapp?.trim() ?? existing.contactWhatsapp,
      defaultCurrency: patch.defaultCurrency ?? existing.defaultCurrency,
      isActive: patch.isActive ?? existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    return this.merchantRepository.save(updated);
  }
}
