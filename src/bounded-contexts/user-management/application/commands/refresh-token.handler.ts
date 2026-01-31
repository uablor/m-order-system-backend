import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { ITokenService } from '../../domain/services/token.service.port';
import { TOKEN_SERVICE } from '../../domain/services/token.service.port';
import { InvalidRefreshTokenException, UserInactiveException } from '../../domain/exceptions';
import { NotFoundException } from '../../../../shared/domain/exceptions';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    let payload: { sub: string };
    try {
      payload = this.tokenService.verifyRefresh(command.refreshToken);
    } catch {
      throw new InvalidRefreshTokenException();
    }
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found', 'USER_NOT_FOUND');
    }
    if (!user.isActive) {
      throw new UserInactiveException();
    }
    const roleName = user.role?.roleName ?? 'STAFF';
    const accessPayload = {
      sub: user.id,
      email: user.email,
      merchantId: user.merchantId,
      roleName,
    };
    const accessToken = this.tokenService.signAccess(accessPayload);
    const refreshToken = this.tokenService.signRefresh({ sub: user.id });
    return { accessToken, refreshToken };
  }
}
