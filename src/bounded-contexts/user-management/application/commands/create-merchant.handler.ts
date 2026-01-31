import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMerchantCommand } from './create-merchant.command';
import { MERCHANT_REPOSITORY, type IMerchantRepository } from '../../domain/repositories/merchant.repository';
import { MerchantEntity } from '../../domain/entities/merchant.entity';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateMerchantCommand)
export class CreateMerchantHandler
  implements ICommandHandler<CreateMerchantCommand, MerchantEntity>
{
  constructor(
    @Inject(MERCHANT_REPOSITORY)
    private readonly merchantRepository: IMerchantRepository,
  ) {}

  async execute(command: CreateMerchantCommand): Promise<MerchantEntity> {
    const merchant = MerchantEntity.create({
      id: generateUuid(),
      ownerUserId: command.ownerUserId,
      shopName: command.shopName.trim(),
      shopLogoUrl: command.shopLogoUrl?.trim(),
      shopAddress: command.shopAddress?.trim(),
      contactPhone: command.contactPhone?.trim(),
      contactEmail: command.contactEmail?.trim(),
      contactFacebook: command.contactFacebook?.trim(),
      contactLine: command.contactLine?.trim(),
      contactWhatsapp: command.contactWhatsapp?.trim(),
      defaultCurrency: command.defaultCurrency,
      isActive: command.isActive,
    });
    return this.merchantRepository.save(merchant);
  }
}
