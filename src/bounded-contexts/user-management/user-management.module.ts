import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { MERCHANT_REPOSITORY } from './domain/repositories/merchant.repository';
import { CUSTOMER_REPOSITORY } from './domain/repositories/customer.repository';
import { UserRepositoryImpl } from './infrastructure/persistence/repositories/user.repository.impl';
import { MerchantRepositoryImpl } from './infrastructure/persistence/repositories/merchant.repository.impl';
import { CustomerRepositoryImpl } from './infrastructure/persistence/repositories/customer.repository.impl';
import {
  UserOrmEntity,
  RoleOrmEntity,
  PermissionOrmEntity,
  MerchantOrmEntity,
  CustomerOrmEntity,
} from './infrastructure/persistence/entities';
import { PASSWORD_HASHER } from './domain/services/password-hasher.port';
import { TOKEN_SERVICE } from './domain/services/token.service.port';
import { BcryptPasswordHasher } from './infrastructure/external-services/bcrypt-password-hasher';
import { JwtServiceImpl } from './infrastructure/external-services/jwt.service.impl';
import { JwtStrategy } from './infrastructure/external-services/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from './infrastructure/external-services/roles.guard';
import { CreateUserHandler } from './application/commands/create-user.handler';
import { UpdateUserHandler } from './application/commands/update-user.handler';
import { LoginHandler } from './application/commands/login.handler';
import { RegisterHandler } from './application/commands/register.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { CreateMerchantHandler } from './application/commands/create-merchant.handler';
import { UpdateMerchantHandler } from './application/commands/update-merchant.handler';
import { DeleteMerchantHandler } from './application/commands/delete-merchant.handler';
import { CreateCustomerHandler } from './application/commands/create-customer.handler';
import { GetUserByIdHandler } from './application/queries/get-user-by-id.handler';
import { GetUserByEmailHandler } from './application/queries/get-user-by-email.handler';
import { GetMerchantHandler } from './application/queries/get-merchant.handler';
import { PaginateMerchantsHandler } from './application/queries/paginate-merchants.handler';
import { GetCustomerHandler } from './application/queries/get-customer.handler';
import { ListCustomersByMerchantHandler } from './application/queries/list-customers-by-merchant.handler';
import { UserController } from './presentation/http/controllers/user.controller';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { MerchantController } from './presentation/http/controllers/merchant.controller';
import { CustomerController } from './presentation/http/controllers/customer.controller';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  LoginHandler,
  RegisterHandler,
  RefreshTokenHandler,
  CreateMerchantHandler,
  UpdateMerchantHandler,
  DeleteMerchantHandler,
  CreateCustomerHandler,
];
const QueryHandlers = [
  GetUserByIdHandler,
  GetUserByEmailHandler,
  GetMerchantHandler,
  PaginateMerchantsHandler,
  GetCustomerHandler,
  ListCustomersByMerchantHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      PermissionOrmEntity,
      MerchantOrmEntity,
      CustomerOrmEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-me-in-production',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRY ?? '15m' },
    }),
  ],
  controllers: [UserController, AuthController, MerchantController, CustomerController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: MERCHANT_REPOSITORY, useClass: MerchantRepositoryImpl },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepositoryImpl },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useClass: JwtServiceImpl },
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    USER_REPOSITORY,
    MERCHANT_REPOSITORY,
    CUSTOMER_REPOSITORY,
    PASSWORD_HASHER,
    TOKEN_SERVICE,
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class UserManagementModule {}
