import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlatformLoginCommand } from './platform-login.command';
import {
  PLATFORM_USER_REPOSITORY,
  type IPlatformUserRepository,
} from '../../domain/repositories/platform-user.repository';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '../../domain/services/password-hasher.port';
import {
  TOKEN_SERVICE,
  type ITokenService,
  type TokenPayload,
} from '../../domain/services/token-service.port';

export interface PlatformLoginResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

@CommandHandler(PlatformLoginCommand)
export class PlatformLoginHandler
  implements ICommandHandler<PlatformLoginCommand, PlatformLoginResult>
{
  constructor(
    @Inject(PLATFORM_USER_REPOSITORY)
    private readonly userRepo: IPlatformUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: PlatformLoginCommand): Promise<PlatformLoginResult> {
    const email = command.email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    const valid = await this.hasher.compare(command.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload: TokenPayload = {
      sub: typeof user.id === 'string' ? user.id : user.id.value,
      email: user.email.value,
      role: user.role,
      isPlatform: true,
    };
    const accessToken = await this.tokenService.sign(payload);

    return {
      accessToken,
      user: {
        id: typeof user.id === 'string' ? user.id : user.id.value,
        email: user.email.value,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
