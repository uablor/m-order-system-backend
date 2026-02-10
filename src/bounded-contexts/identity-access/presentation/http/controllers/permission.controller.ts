import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListPermissionsQuery } from '../../../application/queries/list-permissions.query';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Permissions } from '../../../application/decorators/permissions.decorator';
import { AutoPermissions } from '../../../application/decorators/auto-permissions.decorator';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'permission' })
@ApiBearerAuth('BearerAuth')
export class PermissionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Permissions('permission.list')
  @ApiOperation({ summary: 'List permissions (read-only)' })
  @ApiResponse({ status: 200 })
  async list() {
    return this.queryBus.execute(new ListPermissionsQuery());
  }
}
