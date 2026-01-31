import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RegisterCommand } from './register.command';
import { CreateUserCommand } from './create-user.command';
import type { ITokenService } from '../../domain/services/token.service.port';
import { TOKEN_SERVICE } from '../../domain/services/token.service.port';
import type { UserEntity } from '../../domain/entities/user.entity';

export interface RegisterResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; fullName: string; roleName: string; merchantId: string };
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, RegisterResult> {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(
        command.email,
        command.password,
        command.fullName,
        command.roleId,
        command.merchantId,
      ),
    );
    return this.tokensForUser(user);
  }

  private tokensForUser(user: UserEntity): RegisterResult {
    const roleName = user.role?.roleName ?? 'STAFF';
    const payload = {
      sub: user.id,
      email: user.email,
      merchantId: user.merchantId ?? '',
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
        merchantId: user.merchantId ?? '',
      },
    };
  }
}
