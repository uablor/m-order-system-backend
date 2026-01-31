import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { CreateExchangeRateDto } from '../../../application/dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from '../../../application/dto/update-exchange-rate.dto';
import { CreateExchangeRateCommand } from '../../../application/commands/create-exchange-rate.command';
import { UpdateExchangeRateCommand } from '../../../application/commands/update-exchange-rate.command';
import { GetExchangeRateByDateQuery } from '../../../application/queries/get-exchange-rate-by-date.query';
import { ListExchangeRatesQuery } from '../../../application/queries/list-exchange-rates.query';
import { JwtAuthGuard } from '../../../../user-management/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../../user-management/infrastructure/external-services/roles.guard';
import { Roles } from '../../../../user-management/application/decorators/roles.decorator';

@ApiTags('Exchange Rates')
@Controller('exchange-rates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT', 'SUPERADMIN')
@ApiBearerAuth('BearerAuth')
export class ExchangeRateController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create exchange rate' })
  @ApiResponse({ status: 201, description: 'Exchange rate created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 422, description: 'Duplicate rate' })
  async create(@Body() dto: CreateExchangeRateDto) {
    const rate = await this.commandBus.execute(
      new CreateExchangeRateCommand(
        dto.merchantId,
        dto.baseCurrency,
        dto.targetCurrency,
        dto.rateType,
        dto.rate,
        new Date(dto.rateDate),
      ),
    );
    return {
      id: rate.id,
      merchantId: rate.merchantId,
      baseCurrency: rate.baseCurrency,
      targetCurrency: rate.targetCurrency,
      rateType: rate.rateType,
      rate: rate.rate,
      rateDate: rate.rateDate,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exchange rate' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Exchange rate updated' })
  @ApiResponse({ status: 404, description: 'Exchange rate not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateExchangeRateDto) {
    await this.commandBus.execute(new UpdateExchangeRateCommand(id, dto.rate));
    return { success: true };
  }

  @Get()
  @ApiOperation({ summary: 'List exchange rates' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['BUY', 'SELL'] })
  @ApiQuery({ name: 'currency', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Exchange rates list' })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('date') date?: string,
    @Query('type') type?: 'BUY' | 'SELL',
    @Query('currency') currency?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.queryBus.execute(
      new ListExchangeRatesQuery(
        merchantId,
        date ? new Date(date) : undefined,
        type,
        currency,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined,
      ),
    );
    return result;
  }
}
