import {
  Body,
  Controller,
  Get,
  Param,
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
import { CreateArrivalCommand } from '../../../application/commands/create-arrival.command';
import { AddArrivalItemCommand } from '../../../application/commands/add-arrival-item.command';
import { ConfirmArrivalCommand } from '../../../application/commands/confirm-arrival.command';
import { GetArrivalQuery } from '../../../application/queries/get-arrival.query';
import { ListArrivalsQuery } from '../../../application/queries/list-arrivals.query';
import { CreateArrivalDto } from '../../../application/dto/create-arrival.dto';
import { AddArrivalItemDto } from '../../../application/dto/add-arrival-item.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Permissions } from 'src/bounded-contexts/identity-access/application/decorators/permissions.decorator';
import { AutoPermissions } from 'src/bounded-contexts/identity-access/application/decorators/auto-permissions.decorator';

@ApiTags('Arrivals')
@Controller('arrivals')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'arrival' })
@ApiBearerAuth('BearerAuth')
export class ArrivalController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('arrival.create')
  @ApiOperation({ summary: 'Create arrival record' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateArrivalDto) {
    const aggregate = await this.commandBus.execute(
      new CreateArrivalCommand(
        dto.orderId,
        dto.merchantId,
        dto.arrivedDate,
        dto.recordedBy,
        dto.arrivedTime,
        dto.notes,
      ),
    );
    return { id: aggregate.id.value };
  }

  @Get()
  @Permissions('arrival.list')
  @ApiOperation({ summary: 'List arrivals' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('orderId') orderId: string | undefined,
    @PaginationQuery() pagination: PaginationQueryParams,
  ) {
    return this.queryBus.execute(
      new ListArrivalsQuery(merchantId, orderId, pagination.page, pagination.limit),
    );
  }

  @Get(':id')
  @Permissions('arrival.read')
  @ApiOperation({ summary: 'Get arrival by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetArrivalQuery(id));
  }

  @Post(':id/items')
  @Permissions('arrival.add_items')
  @ApiOperation({ summary: 'Add arrival item (cannot exceed ordered quantity)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 201 })
  async addItem(@Param('id') id: string, @Body() dto: AddArrivalItemDto) {
    const result = await this.commandBus.execute(
      new AddArrivalItemCommand(
        id,
        dto.orderItemId,
        dto.arrivedQuantity,
        dto.condition ?? 'OK',
        dto.notes,
      ),
    );
    return result;
  }

  @Post(':id/confirm')
  @Permissions('arrival.confirm')
  @ApiOperation({ summary: 'Confirm arrival (updates order arrival status)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async confirm(@Param('id') id: string) {
    await this.commandBus.execute(new ConfirmArrivalCommand(id));
    return { success: true };
  }
}
