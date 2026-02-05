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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateExchangeRateCommand } from '../../../application/commands/create-exchange-rate.command';
import { UpdateExchangeRateCommand } from '../../../application/commands/update-exchange-rate.command';
import { DeleteExchangeRateCommand } from '../../../application/commands/delete-exchange-rate.command';
import { GetExchangeRateQuery } from '../../../application/queries/get-exchange-rate.query';
import { ListExchangeRatesQuery } from '../../../application/queries/list-exchange-rates.query';
import { GetExchangeRatesByDateQuery } from '../../../application/queries/get-exchange-rates-by-date.query';
import { CreateExchangeRateDto } from '../../../application/dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from '../../../application/dto/update-exchange-rate.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Roles } from 'src/bounded-contexts/identity-access/application/decorators/roles.decorator';

@ApiTags('Exchange Rates')
@Controller('exchange-rates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class ExchangeRateController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create exchange rate (unique per merchant + date + currency + type)' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'Rate already exists for this combination' })
  async create(@Body() dto: CreateExchangeRateDto) {
    const aggregate = await this.commandBus.execute(
      new CreateExchangeRateCommand(
        dto.merchantId,
        dto.baseCurrency,
        dto.targetCurrency,
        dto.rateType,
        dto.rate,
        dto.rateDate,
        dto.createdBy,
        dto.isActive,
      ),
    );
    return { id: aggregate.id.value };
  }

  @Get()
  @ApiOperation({ summary: 'List exchange rates' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @PaginationQuery() pagination: PaginationQueryParams,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.queryBus.execute(
      new ListExchangeRatesQuery(merchantId, pagination.page, pagination.limit, fromDate, toDate),
    );
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get exchange rates by date' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'rateDate', required: true, example: '2025-02-05' })
  async getByDate(
    @Query('merchantId') merchantId: string,
    @Query('rateDate') rateDate: string,
  ) {
    return this.queryBus.execute(new GetExchangeRatesByDateQuery(merchantId, rateDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exchange rate by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetExchangeRateQuery(id));
  }

  @Patch(':id')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update exchange rate' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async update(@Param('id') id: string, @Body() dto: UpdateExchangeRateDto) {
    const payload: UpdateExchangeRateCommand['payload'] = {};
    if (dto.rate != null) payload.rate = dto.rate;
    if (dto.isActive !== undefined) payload.isActive = dto.isActive;
    await this.commandBus.execute(new UpdateExchangeRateCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete exchange rate' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteExchangeRateCommand(id));
    return { success: true };
  }
}
