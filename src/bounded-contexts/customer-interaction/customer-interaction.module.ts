import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityAccessModule } from '../identity-access/identity-access.module';
import { CustomerMessageOrmEntity } from './infrastructure/persistence/entities/customer-message.orm-entity';
import { CUSTOMER_MESSAGE_REPOSITORY } from './domain/repositories/customer-message.repository';
import { CustomerMessageRepositoryImpl } from './infrastructure/persistence/repositories/customer-message.repository.impl';
import { CreateMessageHandler } from './application/commands/create-message.handler';
import { MarkMessageReadHandler } from './application/commands/mark-message-read.handler';
import { GetMessageHandler } from './application/queries/get-message.handler';
import { ListMessagesHandler } from './application/queries/list-messages.handler';
import { MessageController } from './presentation/http/controllers/message.controller';

@Module({
  imports: [
    CqrsModule,
    IdentityAccessModule,
    TypeOrmModule.forFeature([CustomerMessageOrmEntity]),
  ],
  controllers: [MessageController],
  providers: [
    { provide: CUSTOMER_MESSAGE_REPOSITORY, useClass: CustomerMessageRepositoryImpl },
    CreateMessageHandler,
    MarkMessageReadHandler,
    GetMessageHandler,
    ListMessagesHandler,
  ],
  exports: [CUSTOMER_MESSAGE_REPOSITORY],
})
export class CustomerInteractionModule {}
