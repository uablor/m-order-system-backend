import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import { LoggerModule } from './shared/logger';
import { AuthMiddleware } from './shared/middleware/auth.middleware';
import { IdentityAccessModule } from './bounded-contexts/identity-access/identity-access.module';
import { MerchantManagementModule } from './bounded-contexts/merchant-management/merchant-management.module';
import { CustomerManagementModule } from './bounded-contexts/customer-management/customer-management.module';
import { OrderManagementModule } from './bounded-contexts/order-management/order-management.module';
import { CustomerInteractionModule } from './bounded-contexts/customer-interaction/customer-interaction.module';
import { JwtAuthGuard } from './bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from './bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { AutoPermissionsGuard } from './bounded-contexts/identity-access/infrastructure/external-services/permissions.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: (configService.get<number>('throttle.ttl') ?? 60) * 1000,
            limit: configService.get<number>('throttle.limit') ?? 100,
          },
        ],
      }),
    }),
    LoggerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('database') ?? {},
    }),
    IdentityAccessModule,
    MerchantManagementModule,
    CustomerManagementModule,
    OrderManagementModule,
    CustomerInteractionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: AutoPermissionsGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
