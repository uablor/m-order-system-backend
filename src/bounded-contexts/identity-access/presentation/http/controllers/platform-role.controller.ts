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
import { CreatePlatformRoleCommand } from '../../../application/commands/create-platform-role.command';
import { UpdatePlatformRoleCommand } from '../../../application/commands/update-platform-role.command';
import { DeletePlatformRoleCommand } from '../../../application/commands/delete-platform-role.command';
import { GetPlatformRoleQuery } from '../../../application/queries/get-platform-role.query';
import { ListPlatformRolesQuery } from '../../../application/queries/list-platform-roles.query';
import { CreatePlatformRoleDto } from '../../../application/dto/create-platform-role.dto';
import { UpdatePlatformRoleDto } from '../../../application/dto/update-platform-role.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Permissions } from '../../../application/decorators/permissions.decorator';

@ApiTags('Platform Roles')
@Controller('platform/roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class PlatformRoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('platform_role.create')
  @ApiOperation({ summary: 'Create platform role' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  async create(@Body() dto: CreatePlatformRoleDto) {
    const role = await this.commandBus.execute(
      new CreatePlatformRoleCommand(dto.name),
    );
    return {
      id: typeof role.id === 'string' ? role.id : role.id.value,
      name: role.name,
    };
  }

  @Get()
  @Permissions('platform_role.list')
  @ApiOperation({ summary: 'List platform roles' })
  async list(@PaginationQuery() pagination: PaginationQueryParams) {
    return this.queryBus.execute(
      new ListPlatformRolesQuery(pagination.page, pagination.limit),
    );
  }

  @Get(':id')
  @Permissions('platform_role.read')
  @ApiOperation({ summary: 'Get platform role by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetPlatformRoleQuery(id));
  }

  @Patch(':id')
  @Permissions('platform_role.update')
  @ApiOperation({ summary: 'Update platform role' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async update(@Param('id') id: string, @Body() dto: UpdatePlatformRoleDto) {
    const payload: UpdatePlatformRoleCommand['payload'] = {};
    if (dto.name != null) payload.name = dto.name;
    await this.commandBus.execute(new UpdatePlatformRoleCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Permissions('platform_role.delete')
  @ApiOperation({ summary: 'Delete platform role' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeletePlatformRoleCommand(id));
    return { success: true };
  }
}
