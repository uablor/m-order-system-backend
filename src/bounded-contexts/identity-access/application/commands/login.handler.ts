import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository';
import { ROLE_REPOSITORY, type IRoleRepository } from '../../domain/repositories/role.repository';
import { PERMISSION_REPOSITORY, type IPermissionRepository } from '../../domain/repositories/permission.repository';
import { PASSWORD_HASHER, type IPasswordHasher } from '../../domain/services/password-hasher.port';
import { TOKEN_SERVICE, type ITokenService, type TokenPayload } from '../../domain/services/token-service.port';
import { MERCHANT_PORT, type MerchantPort } from '../../domain/services/merchant.port';

export interface LoginResult {
  accessToken: string;
  refreshToken?: string;
  user: { id: string; email: string; fullName: string; merchantId: string; role: string };
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(MERCHANT_PORT)
    private readonly merchantPort: MerchantPort,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const email = command.email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    const merchantActive = await this.merchantPort.isActive(user.merchantId);
    if (!merchantActive) throw new UnauthorizedException('Merchant is inactive');

    const valid = await this.hasher.compare(command.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const role = await this.roleRepo.findById(user.roleId);
    const roleName = role?.name ?? 'USER';
    const permissions: string[] = [];
    if (role) {
      for (const pid of role.permissionIds) {
        const perm = await this.permissionRepo.findById(pid);
        if (perm) permissions.push(perm.code);
      }
    }

    const payload: TokenPayload = {
      sub: user.id.value,
      email: user.email,
      merchantId: user.merchantId,
      role: roleName,
      permissions,
    };
    const accessToken = await this.tokenService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id.value,
        email: user.email,
        fullName: user.fullName,
        merchantId: user.merchantId,
        role: roleName,
      },
    };
  }
}
