import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserCommand } from '../../../application/commands/create-user.command';
import { UpdateUserCommand } from '../../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../../application/commands/delete-user.command';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id.query';
import { ListUsersQuery } from '../../../application/queries/list-users.query';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../application/dto/update-user.dto';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Roles } from '../../../application/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('OWNER', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(
        dto.email,
        dto.password,
        dto.fullName,
        dto.merchantId,
        dto.roleId,
      ),
    );
    return { id: user.id.value, email: user.email };
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(
      new ListUsersQuery(merchantId, page ? Number(page) : undefined, limit ? Number(limit) : undefined),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Patch(':id')
  @Roles('OWNER', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const payload: UpdateUserCommand['payload'] = {};
    if (dto.email != null) payload.email = dto.email;
    if (dto.password != null) payload.password = dto.password;
    if (dto.fullName != null) payload.fullName = dto.fullName;
    if (dto.roleId != null) payload.roleId = dto.roleId;
    if (dto.isActive != null) payload.isActive = dto.isActive;
    await this.commandBus.execute(new UpdateUserCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Roles('OWNER', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return { success: true };
  }
}
