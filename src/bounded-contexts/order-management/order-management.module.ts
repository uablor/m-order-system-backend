import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityAccessModule } from '../identity-access/identity-access.module';
import {
  ExchangeRateOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
  CustomerOrderOrmEntity,
  CustomerOrderItemOrmEntity,
  ArrivalOrmEntity,
  ArrivalItemOrmEntity,
} from './infrastructure/persistence/entities';
import { EXCHANGE_RATE_REPOSITORY } from './domain/repositories/exchange-rate.repository';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { CUSTOMER_ORDER_REPOSITORY } from './domain/repositories/customer-order.repository';
import { ARRIVAL_REPOSITORY } from './domain/repositories/arrival.repository';
import { ExchangeRateRepositoryImpl } from './infrastructure/persistence/repositories/exchange-rate.repository.impl';
import { OrderRepositoryImpl } from './infrastructure/persistence/repositories/order.repository.impl';
import { CustomerOrderRepositoryImpl } from './infrastructure/persistence/repositories/customer-order.repository.impl';
import { ArrivalRepositoryImpl } from './infrastructure/persistence/repositories/arrival.repository.impl';

import { CreateExchangeRateHandler } from './application/commands/create-exchange-rate.handler';
import { UpdateExchangeRateHandler } from './application/commands/update-exchange-rate.handler';
import { DeleteExchangeRateHandler } from './application/commands/delete-exchange-rate.handler';
import { CreateOrderHandler } from './application/commands/create-order.handler';
import { UpdateOrderHandler } from './application/commands/update-order.handler';
import { DeleteOrderHandler } from './application/commands/delete-order.handler';
import { AddOrderItemHandler } from './application/commands/add-order-item.handler';
import { UpdateOrderItemHandler } from './application/commands/update-order-item.handler';
import { DeleteOrderItemHandler } from './application/commands/delete-order-item.handler';
import { CalculateOrderHandler } from './application/commands/calculate-order.handler';
import { CloseOrderHandler } from './application/commands/close-order.handler';
import { CreateCustomerOrderHandler } from './application/commands/create-customer-order.handler';
import { AddCustomerOrderItemHandler } from './application/commands/add-customer-order-item.handler';
import { DeleteCustomerOrderHandler } from './application/commands/delete-customer-order.handler';
import { CreateArrivalHandler } from './application/commands/create-arrival.handler';
import { AddArrivalItemHandler } from './application/commands/add-arrival-item.handler';
import { ConfirmArrivalHandler } from './application/commands/confirm-arrival.handler';

import { GetExchangeRateHandler } from './application/queries/get-exchange-rate.handler';
import { ListExchangeRatesHandler } from './application/queries/list-exchange-rates.handler';
import { GetExchangeRatesByDateHandler } from './application/queries/get-exchange-rates-by-date.handler';
import { GetOrderHandler } from './application/queries/get-order.handler';
import { ListOrdersHandler } from './application/queries/list-orders.handler';
import { GetCustomerOrderHandler } from './application/queries/get-customer-order.handler';
import { ListCustomerOrdersHandler } from './application/queries/list-customer-orders.handler';
import { GetArrivalHandler } from './application/queries/get-arrival.handler';
import { ListArrivalsHandler } from './application/queries/list-arrivals.handler';

import { ExchangeRateController } from './presentation/http/controllers/exchange-rate.controller';
import { OrderController } from './presentation/http/controllers/order.controller';
import { CustomerOrderController } from './presentation/http/controllers/customer-order.controller';
import { ArrivalController } from './presentation/http/controllers/arrival.controller';

const CommandHandlers = [
  CreateExchangeRateHandler,
  UpdateExchangeRateHandler,
  DeleteExchangeRateHandler,
  CreateOrderHandler,
  UpdateOrderHandler,
  DeleteOrderHandler,
  AddOrderItemHandler,
  UpdateOrderItemHandler,
  DeleteOrderItemHandler,
  CalculateOrderHandler,
  CloseOrderHandler,
  CreateCustomerOrderHandler,
  AddCustomerOrderItemHandler,
  DeleteCustomerOrderHandler,
  CreateArrivalHandler,
  AddArrivalItemHandler,
  ConfirmArrivalHandler,
];

const QueryHandlers = [
  GetExchangeRateHandler,
  ListExchangeRatesHandler,
  GetExchangeRatesByDateHandler,
  GetOrderHandler,
  ListOrdersHandler,
  GetCustomerOrderHandler,
  ListCustomerOrdersHandler,
  GetArrivalHandler,
  ListArrivalsHandler,
];

@Module({
  imports: [
    CqrsModule,
    IdentityAccessModule,
    TypeOrmModule.forFeature([
      ExchangeRateOrmEntity,
      OrderOrmEntity,
      OrderItemOrmEntity,
      CustomerOrderOrmEntity,
      CustomerOrderItemOrmEntity,
      ArrivalOrmEntity,
      ArrivalItemOrmEntity,
    ]),
  ],
  controllers: [
    ExchangeRateController,
    OrderController,
    CustomerOrderController,
    ArrivalController,
  ],
  providers: [
    { provide: EXCHANGE_RATE_REPOSITORY, useClass: ExchangeRateRepositoryImpl },
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    { provide: CUSTOMER_ORDER_REPOSITORY, useClass: CustomerOrderRepositoryImpl },
    { provide: ARRIVAL_REPOSITORY, useClass: ArrivalRepositoryImpl },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    EXCHANGE_RATE_REPOSITORY,
    ORDER_REPOSITORY,
    CUSTOMER_ORDER_REPOSITORY,
    ARRIVAL_REPOSITORY,
  ],
})
export class OrderManagementModule {}
