import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  UserOrmEntity,
  RoleOrmEntity,
  RolePermissionOrmEntity,
  PermissionOrmEntity,
  PlatformUserOrmEntity,
  PlatformRoleOrmEntity,
  PlatformRolePermissionOrmEntity,
} from './infrastructure/persistence/entities';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PLATFORM_USER_REPOSITORY } from './domain/repositories/platform-user.repository';
import { PLATFORM_ROLE_REPOSITORY } from './domain/repositories/platform-role.repository';
import { PLATFORM_ROLE_PERMISSION_REPOSITORY } from './domain/repositories/platform-role-permission.repository';
import { ROLE_REPOSITORY } from './domain/repositories/role.repository';
import { PERMISSION_REPOSITORY } from './domain/repositories/permission.repository';
import { PASSWORD_HASHER } from './domain/services/password-hasher.port';
import { TOKEN_SERVICE } from './domain/services/token-service.port';
import { MERCHANT_PORT } from './domain/services/merchant.port';
import { UserRepositoryImpl } from './infrastructure/persistence/repositories/user.repository.impl';
import { PlatformUserRepositoryImpl } from './infrastructure/persistence/repositories/platform-user.repository.impl';
import { PlatformRoleRepositoryImpl } from './infrastructure/persistence/repositories/platform-role.repository.impl';
import { PlatformRolePermissionRepositoryImpl } from './infrastructure/persistence/repositories/platform-role-permission.repository.impl';
import { RoleRepositoryImpl } from './infrastructure/persistence/repositories/role.repository.impl';
import { PermissionRepositoryImpl } from './infrastructure/persistence/repositories/permission.repository.impl';
import { BcryptPasswordHasher } from './infrastructure/external-services/bcrypt-password-hasher';
import { JwtServiceImpl } from './infrastructure/external-services/jwt.service.impl';
import { JwtStrategy } from './infrastructure/external-services/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from './infrastructure/external-services/roles.guard';
import {
  PermissionsGuard,
  AutoPermissionsGuard,
} from './infrastructure/external-services/permissions.guard';
import { MerchantPortStubAdapter } from './infrastructure/external-services/merchant-port-stub.adapter';
import { CreateUserHandler } from './application/commands/create-user.handler';
import { UpdateUserHandler } from './application/commands/update-user.handler';
import { DeleteUserHandler } from './application/commands/delete-user.handler';
import { LoginHandler } from './application/commands/login.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { CreateRoleHandler } from './application/commands/create-role.handler';
import { UpdateRoleHandler } from './application/commands/update-role.handler';
import { DeleteRoleHandler } from './application/commands/delete-role.handler';
import { PutRolePermissionsHandler } from './application/commands/put-role-permissions.handler';
import { CreatePlatformUserHandler } from './application/commands/create-platform-user.handler';
import { UpdatePlatformUserHandler } from './application/commands/update-platform-user.handler';
import { DeletePlatformUserHandler } from './application/commands/delete-platform-user.handler';
import { ChangePlatformUserRoleHandler } from './application/commands/change-platform-user-role.handler';
import { DeactivatePlatformUserHandler } from './application/commands/deactivate-platform-user.handler';
import { PlatformLoginHandler } from './application/commands/platform-login.handler';
import { CreatePlatformRoleHandler } from './application/commands/create-platform-role.handler';
import { UpdatePlatformRoleHandler } from './application/commands/update-platform-role.handler';
import { DeletePlatformRoleHandler } from './application/commands/delete-platform-role.handler';
import { GetUserByIdHandler } from './application/queries/get-user-by-id.handler';
import { ListUsersHandler } from './application/queries/list-users.handler';
import { GetRoleHandler } from './application/queries/get-role.handler';
import { ListRolesHandler } from './application/queries/list-roles.handler';
import { ListPermissionsHandler } from './application/queries/list-permissions.handler';
import { GetPlatformRoleHandler } from './application/queries/get-platform-role.handler';
import { ListPlatformRolesHandler } from './application/queries/list-platform-roles.handler';
import { GetPlatformUserHandler } from './application/queries/get-platform-user.handler';
import { ListPlatformUsersHandler } from './application/queries/list-platform-users.handler';
import { UserController } from './presentation/http/controllers/user.controller';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { RoleController } from './presentation/http/controllers/role.controller';
import { PermissionController } from './presentation/http/controllers/permission.controller';
import { PlatformAuthController } from './presentation/http/controllers/platform-auth.controller';
import { PlatformRoleController } from './presentation/http/controllers/platform-role.controller';
import { PlatformUserController } from './presentation/http/controllers/platform-user.controller';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  LoginHandler,
  RefreshTokenHandler,
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
  PutRolePermissionsHandler,
  CreatePlatformUserHandler,
  UpdatePlatformUserHandler,
  DeletePlatformUserHandler,
  ChangePlatformUserRoleHandler,
  DeactivatePlatformUserHandler,
  PlatformLoginHandler,
  CreatePlatformRoleHandler,
  UpdatePlatformRoleHandler,
  DeletePlatformRoleHandler,
];
const QueryHandlers = [
  GetUserByIdHandler,
  ListUsersHandler,
  GetRoleHandler,
  ListRolesHandler,
  ListPermissionsHandler,
  GetPlatformRoleHandler,
  ListPlatformRolesHandler,
  GetPlatformUserHandler,
  ListPlatformUsersHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      RolePermissionOrmEntity,
      PermissionOrmEntity,
      PlatformUserOrmEntity,
      PlatformRoleOrmEntity,
      PlatformRolePermissionOrmEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-me-in-production',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRY ?? '15m' },
    }),
  ],
  controllers: [
    UserController,
    AuthController,
    RoleController,
    PermissionController,
    PlatformAuthController,
    PlatformRoleController,
    PlatformUserController,
  ],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: PLATFORM_USER_REPOSITORY, useClass: PlatformUserRepositoryImpl },
    { provide: PLATFORM_ROLE_REPOSITORY, useClass: PlatformRoleRepositoryImpl },
    {
      provide: PLATFORM_ROLE_PERMISSION_REPOSITORY,
      useClass: PlatformRolePermissionRepositoryImpl,
    },
    { provide: ROLE_REPOSITORY, useClass: RoleRepositoryImpl },
    { provide: PERMISSION_REPOSITORY, useClass: PermissionRepositoryImpl },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useClass: JwtServiceImpl },
    { provide: MERCHANT_PORT, useClass: MerchantPortStubAdapter },
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    AutoPermissionsGuard,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [
    USER_REPOSITORY,
    PLATFORM_USER_REPOSITORY,
    PLATFORM_ROLE_REPOSITORY,
    PLATFORM_ROLE_PERMISSION_REPOSITORY,
    ROLE_REPOSITORY,
    PERMISSION_REPOSITORY,
    PASSWORD_HASHER,
    TOKEN_SERVICE,
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    AutoPermissionsGuard,
  ],
})
export class IdentityAccessModule {}
