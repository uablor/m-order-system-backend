import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlatformLoginCommand } from 'src/bounded-contexts/identity-access/application/commands/platform-login.command';
import { RefreshTokenCommand } from 'src/bounded-contexts/identity-access/application/commands/refresh-token.command';
import { Public } from 'src/bounded-contexts/identity-access/application/decorators/public.decorator';
import { PlatformLoginDto } from 'src/bounded-contexts/identity-access/application/dto/platform-login.dto';
import { RefreshTokenDto } from 'src/bounded-contexts/identity-access/application/dto/refresh-token.dto';

@ApiTags('Platform Auth')
@Controller('auth/platform')
export class PlatformAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login as platform user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: PlatformLoginDto) {
    return this.commandBus.execute(
      new PlatformLoginCommand(dto.email, dto.password),
    );
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Refresh platform token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(dto.refreshToken));
  }
}
