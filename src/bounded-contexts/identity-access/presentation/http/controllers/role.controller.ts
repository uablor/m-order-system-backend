import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { CreateRoleCommand } from '../../../application/commands/create-role.command';
import { UpdateRoleCommand } from '../../../application/commands/update-role.command';
import { DeleteRoleCommand } from '../../../application/commands/delete-role.command';
import { PutRolePermissionsCommand } from '../../../application/commands/put-role-permissions.command';
import { GetRoleQuery } from '../../../application/queries/get-role.query';
import { ListRolesQuery } from '../../../application/queries/list-roles.query';
import { CreateRoleDto } from '../../../application/dto/create-role.dto';
import { UpdateRoleDto } from '../../../application/dto/update-role.dto';
import { PutRolePermissionsDto } from '../../../application/dto/put-role-permissions.dto';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Permissions } from '../../../application/decorators/permissions.decorator';
import { AutoPermissions } from '../../../application/decorators/auto-permissions.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'role' })
@ApiBearerAuth('BearerAuth')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('role.create')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.commandBus.execute(
      new CreateRoleCommand(dto.name, dto.merchantId ?? null, dto.permissionIds),
    );
    return { id: role.id.value, name: role.name };
  }

  @Get()
  @Permissions('role.list')
  @ApiOperation({ summary: 'List roles' })
  @ApiQuery({ name: 'merchantId', required: false })
  async list(@Query('merchantId') merchantId?: string) {
    return this.queryBus.execute(new ListRolesQuery(merchantId));
  }

  @Get(':id')
  @Permissions('role.read')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetRoleQuery(id));
  }

  @Patch(':id')
  @Permissions('role.update')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const payload: UpdateRoleCommand['payload'] = {};
    if (dto.name != null) payload.name = dto.name;
    if (dto.merchantId !== undefined) payload.merchantId = dto.merchantId;
    if (dto.permissionIds != null) payload.permissionIds = dto.permissionIds;
    await this.commandBus.execute(new UpdateRoleCommand(id, payload));
    return { success: true };
  }

  @Put(':id/permissions')
  @Permissions('role.put_permissions')
  @ApiOperation({ summary: 'Replace role permissions' })
  @ApiResponse({ status: 200 })
  async putPermissions(@Param('id') id: string, @Body() dto: PutRolePermissionsDto) {
    await this.commandBus.execute(new PutRolePermissionsCommand(id, dto.permissionIds));
    return { success: true };
  }

  @Delete(':id')
  @Permissions('role.delete')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteRoleCommand(id));
    return { success: true };
  }
}
