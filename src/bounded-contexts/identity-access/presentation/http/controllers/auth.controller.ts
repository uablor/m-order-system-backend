import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginCommand } from '../../../application/commands/login.command';
import { RefreshTokenCommand } from '../../../application/commands/refresh-token.command';
import { LoginDto } from '../../../application/dto/login.dto';
import { RefreshTokenDto } from '../../../application/dto/refresh-token.dto';
import { Public } from '../../../application/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  async login(@Body() dto: LoginDto) {
    return this.commandBus.execute(new LoginCommand(dto.email, dto.password));
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(dto.refreshToken));
  }
}
