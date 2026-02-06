import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { TOKEN_SERVICE, type ITokenService } from '../../domain/services/token-service.port';

export interface RefreshTokenResult {
  accessToken: string;
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const payload = this.tokenService.decode(command.refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid refresh token');
    const accessToken = await this.tokenService.sign({
      sub: payload.sub,
      email: payload.email,
      merchantId: payload.merchantId,
      role: payload.role,
      permissions: payload.permissions,
      isPlatform: payload.isPlatform,
    });
    return { accessToken };
  }
}
