import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListPermissionsQuery } from '../../../application/queries/list-permissions.query';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('BearerAuth')
export class PermissionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'List permissions (read-only)' })
  @ApiResponse({ status: 200 })
  async list() {
    return this.queryBus.execute(new ListPermissionsQuery());
  }
}
