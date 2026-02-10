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
import { CreateMerchantCommand } from '../../../application/commands/create-merchant.command';
import { UpdateMerchantCommand } from '../../../application/commands/update-merchant.command';
import { DeleteMerchantCommand } from '../../../application/commands/delete-merchant.command';
import { GetMerchantQuery } from '../../../application/queries/get-merchant.query';
import { ListMerchantsQuery } from '../../../application/queries/list-merchants.query';
import { CreateMerchantDto } from '../../../application/dto/create-merchant.dto';
import { UpdateMerchantDto } from '../../../application/dto/update-merchant.dto';

import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { Permissions } from 'src/bounded-contexts/identity-access/application/decorators/permissions.decorator';
import { AutoPermissions } from 'src/bounded-contexts/identity-access/application/decorators/auto-permissions.decorator';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';

@ApiTags('Merchants')
@Controller('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'merchant' })
@ApiBearerAuth('BearerAuth')
export class MerchantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('merchant.create')
  @ApiOperation({ summary: 'Create merchant (and owner user)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateMerchantDto) {
    return this.commandBus.execute(
      new CreateMerchantCommand(
        dto.shopName,
        dto.defaultCurrency,
        dto.ownerEmail,
        dto.ownerPassword,
        dto.ownerFullName,
      ),
    );
  }

  @Get()
  @Permissions('merchant.list')
  @ApiOperation({ summary: 'List merchants' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(@PaginationQuery() pagination: PaginationQueryParams) {
    return this.queryBus.execute(
      new ListMerchantsQuery(pagination.page, pagination.limit),
    );
  }

  @Get(':id')
  @Permissions('merchant.read')
  @ApiOperation({ summary: 'Get merchant by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetMerchantQuery(id));
  }

  @Patch(':id')
  @Permissions('merchant.update')
  @ApiOperation({ summary: 'Update merchant' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateMerchantDto) {
    const payload: UpdateMerchantCommand['payload'] = {};
    if (dto.shopName != null) payload.shopName = dto.shopName;
    if (dto.defaultCurrency != null) payload.defaultCurrency = dto.defaultCurrency;
    if (dto.isActive != null) payload.isActive = dto.isActive;
    await this.commandBus.execute(new UpdateMerchantCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Permissions('merchant.delete')
  @ApiOperation({ summary: 'Delete merchant' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteMerchantCommand(id));
    return { success: true };
  }
}
