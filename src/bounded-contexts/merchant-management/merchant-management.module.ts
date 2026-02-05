import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityAccessModule } from '../identity-access/identity-access.module';
import { MERCHANT_REPOSITORY } from './domain/repositories/merchant.repository';
import { MerchantRepositoryImpl } from './infrastructure/persistence/repositories/merchant.repository.impl';
import { MerchantOrmEntity } from './infrastructure/persistence/entities';
import { CreateMerchantHandler } from './application/commands/create-merchant.handler';
import { UpdateMerchantHandler } from './application/commands/update-merchant.handler';
import { DeleteMerchantHandler } from './application/commands/delete-merchant.handler';
import { GetMerchantHandler } from './application/queries/get-merchant.handler';
import { ListMerchantsHandler } from './application/queries/list-merchants.handler';
import { MerchantController } from './presentation/http/controllers/merchant.controller';

const CommandHandlers = [CreateMerchantHandler, UpdateMerchantHandler, DeleteMerchantHandler];
const QueryHandlers = [GetMerchantHandler, ListMerchantsHandler];

@Module({
  imports: [
    CqrsModule,
    IdentityAccessModule,
    TypeOrmModule.forFeature([MerchantOrmEntity]),
  ],
  controllers: [MerchantController],
  providers: [
    { provide: MERCHANT_REPOSITORY, useClass: MerchantRepositoryImpl },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [MERCHANT_REPOSITORY],
})
export class MerchantManagementModule {}
