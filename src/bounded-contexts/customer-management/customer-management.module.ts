import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityAccessModule } from '../identity-access/identity-access.module';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository';
import { CustomerRepositoryImpl } from './infrastructure/persistence/repositories/customer.repository.impl';
import { CustomerOrmEntity } from './infrastructure/persistence/entities';
import { CreateCustomerHandler } from './application/commands/create-customer.handler';
import { UpdateCustomerHandler } from './application/commands/update-customer.handler';
import { DeleteCustomerHandler } from './application/commands/delete-customer.handler';
import { GetCustomerHandler } from './application/queries/get-customer.handler';
import { GetCustomerByTokenHandler } from './application/queries/get-customer-by-token.handler';
import { ListCustomersHandler } from './application/queries/list-customers.handler';
import { CustomerController } from './presentation/http/controllers/customer.controller';

const CommandHandlers = [CreateCustomerHandler, UpdateCustomerHandler, DeleteCustomerHandler];
const QueryHandlers = [
  GetCustomerHandler,
  GetCustomerByTokenHandler,
  ListCustomersHandler,
];

@Module({
  imports: [
    CqrsModule,
    IdentityAccessModule,
    TypeOrmModule.forFeature([CustomerOrmEntity]),
  ],
  controllers: [CustomerController],
  providers: [
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepositoryImpl },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomerManagementModule {}
