import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMerchantDto } from '../../../application/dto/create-merchant.dto';
import { UpdateMerchantDto } from '../../../application/dto/update-merchant.dto';
import { CreateMerchantCommand } from '../../../application/commands/create-merchant.command';
import { UpdateMerchantCommand } from '../../../application/commands/update-merchant.command';
import { DeleteMerchantCommand } from '../../../application/commands/delete-merchant.command';
import { GetMerchantQuery } from '../../../application/queries/get-merchant.query';
import { PaginateMerchantsQuery } from '../../../application/queries/paginate-merchants.query';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Roles } from '../../../application/decorators/roles.decorator';
import type { DefaultCurrency } from '../../../domain/entities/merchant.entity';

@ApiTags('Merchant')
@Controller('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT')
@ApiBearerAuth('BearerAuth')
export class MerchantController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Merchant' })
  @ApiResponse({ status: 201, description: 'Merchant created' })
  async create(@Body() dto: CreateMerchantDto) {
    const merchant = await this.commandBus.execute(
      new CreateMerchantCommand(
        dto.ownerUserId,
        dto.shopName,
        dto.defaultCurrency as DefaultCurrency,
        dto.isActive ?? true,
        dto.shopLogoUrl,
        dto.shopAddress,
        dto.contactPhone,
        dto.contactEmail,
        dto.contactFacebook,
        dto.contactLine,
        dto.contactWhatsapp,
      ),
    );
    return this.toResponse(merchant);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Merchant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Merchant updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateMerchantDto) {
    const merchant = await this.commandBus.execute(
      new UpdateMerchantCommand(id, { ...dto, defaultCurrency: dto.defaultCurrency as DefaultCurrency | undefined }),
    );
    return this.toResponse(merchant);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Merchant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Merchant deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteMerchantCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Merchant by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Merchant' })
  async get(@Param('id') id: string) {
    const merchant = await this.queryBus.execute(new GetMerchantQuery(id));
    return this.toResponse(merchant);
  }

  @Get()
  @ApiOperation({ summary: 'Paginate Merchants' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Paginated merchants' })
  async paginate(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    const result = await this.queryBus.execute(new PaginateMerchantsQuery(page, limit));
    return {
      ...result,
      items: result.items.map((m: { id: string; ownerUserId: string; shopName: string; shopLogoUrl?: string; shopAddress?: string; contactPhone?: string; contactEmail?: string; contactFacebook?: string; contactLine?: string; contactWhatsapp?: string; defaultCurrency: string; isActive: boolean; createdAt?: Date; updatedAt?: Date }) =>
        this.toResponse(m),
      ),
    };
  }

  private toResponse(merchant: {
    id: string;
    ownerUserId: string;
    shopName: string;
    shopLogoUrl?: string;
    shopAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
    contactFacebook?: string;
    contactLine?: string;
    contactWhatsapp?: string;
    defaultCurrency: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return {
      id: merchant.id,
      ownerUserId: merchant.ownerUserId,
      shopName: merchant.shopName,
      shopLogoUrl: merchant.shopLogoUrl,
      shopAddress: merchant.shopAddress,
      contactPhone: merchant.contactPhone,
      contactEmail: merchant.contactEmail,
      contactFacebook: merchant.contactFacebook,
      contactLine: merchant.contactLine,
      contactWhatsapp: merchant.contactWhatsapp,
      defaultCurrency: merchant.defaultCurrency,
      isActive: merchant.isActive,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
    };
  }
}
