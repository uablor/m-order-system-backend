import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository';
import { CUSTOMER_ORDER_REPOSITORY } from './domain/repositories/customer-order.repository';
import { PAYMENT_REPOSITORY } from './domain/repositories/payment.repository';
import { ARRIVAL_REPOSITORY } from './domain/repositories/arrival.repository';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository';
import { EXCHANGE_RATE_REPOSITORY } from './domain/repositories/exchange-rate.repository';
import { OrderRepositoryImpl } from './infrastructure/persistence/repositories/order.repository.impl';
import { CustomerOrderRepositoryImpl } from './infrastructure/persistence/repositories/customer-order.repository.impl';
import { PaymentRepositoryImpl } from './infrastructure/persistence/repositories/payment.repository.impl';
import { ArrivalRepositoryImpl } from './infrastructure/persistence/repositories/arrival.repository.impl';
import { NotificationRepositoryImpl } from './infrastructure/persistence/repositories/notification.repository.impl';
import { ExchangeRateRepositoryImpl } from './infrastructure/persistence/repositories/exchange-rate.repository.impl';
import {
  OrderOrmEntity,
  OrderItemOrmEntity,
  CustomerOrderOrmEntity,
  CustomerOrderItemOrmEntity,
  ArrivalOrmEntity,
  ArrivalItemOrmEntity,
  PaymentOrmEntity,
  NotificationOrmEntity,
  ExchangeRateOrmEntity,
} from './infrastructure/persistence/entities';
import { CreateOrderHandler } from './application/commands/create-order.handler';
import { CreateExchangeRateHandler } from './application/commands/create-exchange-rate.handler';
import { UpdateExchangeRateHandler } from './application/commands/update-exchange-rate.handler';
import { CreateCustomerOrderHandler } from './application/commands/create-customer-order.handler';
import { AddCustomerOrderItemHandler } from './application/commands/add-customer-order-item.handler';
import { RecordPaymentHandler } from './application/commands/record-payment.handler';
import { RecordArrivalHandler } from './application/commands/record-arrival.handler';
import { SendNotificationHandler } from './application/commands/send-notification.handler';
import { GetOrderHandler } from './application/queries/get-order.handler';
import { ListOrdersHandler } from './application/queries/list-orders.handler';
import { GetExchangeRateByDateHandler } from './application/queries/get-exchange-rate-by-date.handler';
import { ListExchangeRatesHandler } from './application/queries/list-exchange-rates.handler';
import { GetCustomerOrderHandler } from './application/queries/get-customer-order.handler';
import { ListCustomerOrdersHandler } from './application/queries/list-customer-orders.handler';
import { GetOrderProfitHandler } from './application/queries/get-order-profit.handler';
import { ExchangeRateController } from './presentation/http/controllers/exchange-rate.controller';
import { CustomerOrderController } from './presentation/http/controllers/customer-order.controller';
import { PaymentController } from './presentation/http/controllers/payment.controller';
import { ArrivalController } from './presentation/http/controllers/arrival.controller';
import { NotificationController } from './presentation/http/controllers/notification.controller';
import { OrderController } from './presentation/http/controllers/order.controller';
import { UserManagementModule } from '../user-management/user-management.module';

const CommandHandlers = [
  CreateOrderHandler,
  CreateExchangeRateHandler,
  UpdateExchangeRateHandler,
  CreateCustomerOrderHandler,
  AddCustomerOrderItemHandler,
  RecordPaymentHandler,
  RecordArrivalHandler,
  SendNotificationHandler,
];

const QueryHandlers = [
  GetOrderHandler,
  ListOrdersHandler,
  GetExchangeRateByDateHandler,
  ListExchangeRatesHandler,
  GetCustomerOrderHandler,
  ListCustomerOrdersHandler,
  GetOrderProfitHandler,
];

@Module({
  imports: [
    CqrsModule,
    UserManagementModule,
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderItemOrmEntity,
      CustomerOrderOrmEntity,
      CustomerOrderItemOrmEntity,
      ArrivalOrmEntity,
      ArrivalItemOrmEntity,
      PaymentOrmEntity,
      NotificationOrmEntity,
      ExchangeRateOrmEntity,
    ]),
  ],
  controllers: [
    OrderController,
    ExchangeRateController,
    CustomerOrderController,
    PaymentController,
    ArrivalController,
    NotificationController,
  ],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    { provide: CUSTOMER_ORDER_REPOSITORY, useClass: CustomerOrderRepositoryImpl },
    { provide: PAYMENT_REPOSITORY, useClass: PaymentRepositoryImpl },
    { provide: ARRIVAL_REPOSITORY, useClass: ArrivalRepositoryImpl },
    { provide: NOTIFICATION_REPOSITORY, useClass: NotificationRepositoryImpl },
    { provide: EXCHANGE_RATE_REPOSITORY, useClass: ExchangeRateRepositoryImpl },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    ORDER_REPOSITORY,
    CUSTOMER_ORDER_REPOSITORY,
    PAYMENT_REPOSITORY,
    ARRIVAL_REPOSITORY,
    NOTIFICATION_REPOSITORY,
    EXCHANGE_RATE_REPOSITORY,
  ],
})
export class OrderManagementModule {}
