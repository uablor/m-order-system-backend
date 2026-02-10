import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlatformUserCommand } from '../../../application/commands/create-platform-user.command';
import { UpdatePlatformUserCommand } from '../../../application/commands/update-platform-user.command';
import { DeletePlatformUserCommand } from '../../../application/commands/delete-platform-user.command';
import { GetPlatformUserQuery } from '../../../application/queries/get-platform-user.query';
import { ListPlatformUsersQuery } from '../../../application/queries/list-platform-users.query';
import { CreatePlatformUserDto } from '../../../application/dto/create-platform-user.dto';
import { UpdatePlatformUserDto } from '../../../application/dto/update-platform-user.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Roles } from '../../../application/decorators/roles.decorator';

@ApiTags('Platform Users')
@Controller('platform/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class PlatformUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create platform user' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreatePlatformUserDto) {
    const user = await this.commandBus.execute(
      new CreatePlatformUserCommand(
        dto.email,
        dto.password,
        dto.fullName,
        dto.role,
      ),
    );
    const id = typeof user.id === 'string' ? user.id : user.id.value;
    return { id, email: user.email.value };
  }

  @Get()
  @Roles('SUPER_ADMIN', 'SUPPORT', 'FINANCE')
  @ApiOperation({ summary: 'List platform users' })
  async list(@PaginationQuery() pagination: PaginationQueryParams) {
    return this.queryBus.execute(
      new ListPlatformUsersQuery(pagination.page, pagination.limit),
    );
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'SUPPORT', 'FINANCE')
  @ApiOperation({ summary: 'Get platform user by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetPlatformUserQuery(id));
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update platform user' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async update(@Param('id') id: string, @Body() dto: UpdatePlatformUserDto) {
    const payload: UpdatePlatformUserCommand['payload'] = {};
    if (dto.fullName != null) payload.fullName = dto.fullName;
    if (dto.role != null) payload.role = dto.role;
    if (dto.isActive != null) payload.isActive = dto.isActive;
    if (dto.password != null) payload.password = dto.password;
    await this.commandBus.execute(new UpdatePlatformUserCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete platform user' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeletePlatformUserCommand(id));
    return { success: true };
  }
}
