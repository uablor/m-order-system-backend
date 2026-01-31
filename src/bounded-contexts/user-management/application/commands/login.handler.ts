import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher.port';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher.port';
import type { ITokenService } from '../../domain/services/token.service.port';
import { TOKEN_SERVICE } from '../../domain/services/token.service.port';
import { InvalidCredentialsException, UserInactiveException } from '../../domain/exceptions';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; fullName: string; roleName: string };
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (!user.isActive) {
      throw new UserInactiveException();
    }
    const valid = await this.passwordHasher.verify(command.password, user.passwordHash);
    if (!valid) {
      throw new InvalidCredentialsException();
    }
    const roleName = user.role?.roleName ?? 'STAFF';
    const payload = {
      sub: user.id,
      email: user.email,
      roleName,
    };
    const accessToken = this.tokenService.signAccess(payload);
    const refreshToken = this.tokenService.signRefresh({ sub: user.id });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roleName,
      },
    };
  }
}
