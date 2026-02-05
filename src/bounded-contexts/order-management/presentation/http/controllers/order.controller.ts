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
import { CreateOrderCommand } from '../../../application/commands/create-order.command';
import { UpdateOrderCommand } from '../../../application/commands/update-order.command';
import { DeleteOrderCommand } from '../../../application/commands/delete-order.command';
import { AddOrderItemCommand } from '../../../application/commands/add-order-item.command';
import { UpdateOrderItemCommand } from '../../../application/commands/update-order-item.command';
import { DeleteOrderItemCommand } from '../../../application/commands/delete-order-item.command';
import { CalculateOrderCommand } from '../../../application/commands/calculate-order.command';
import { CloseOrderCommand } from '../../../application/commands/close-order.command';
import { GetOrderQuery } from '../../../application/queries/get-order.query';
import { ListOrdersQuery } from '../../../application/queries/list-orders.query';
import { CreateOrderDto } from '../../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../../application/dto/update-order.dto';
import { AddOrderItemDto } from '../../../application/dto/add-order-item.dto';
import { UpdateOrderItemDto } from '../../../application/dto/update-order-item.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Roles } from 'src/bounded-contexts/identity-access/application/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create order (import bill)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateOrderDto) {
    const aggregate = await this.commandBus.execute(
      new CreateOrderCommand(dto.merchantId, dto.createdBy, dto.orderCode, dto.orderDate),
    );
    return { id: aggregate.id.value };
  }

  @Get()
  @ApiOperation({ summary: 'List orders' })
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
      new ListOrdersQuery(merchantId, pagination.page, pagination.limit, fromDate, toDate),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'merchantId', required: false })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string, @Query('merchantId') merchantId?: string) {
    return this.queryBus.execute(new GetOrderQuery(id, merchantId));
  }

  @Patch(':id')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update order' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    const payload: UpdateOrderCommand['payload'] = {};
    if (dto.orderCode != null) payload.orderCode = dto.orderCode;
    if (dto.orderDate != null) payload.orderDate = new Date(dto.orderDate);
    await this.commandBus.execute(new UpdateOrderCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete order' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteOrderCommand(id));
    return { success: true };
  }

  @Post(':id/items')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Add order item' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 201 })
  async addItem(@Param('id') id: string, @Body() dto: AddOrderItemDto) {
    const result = await this.commandBus.execute(
      new AddOrderItemCommand(
        id,
        dto.productName,
        dto.variant ?? '',
        dto.quantity,
        dto.purchaseCurrency,
        dto.purchasePrice,
        dto.purchaseExchangeRate,
        dto.discountType ?? 'FIX',
        dto.discountValue ?? 0,
        dto.sellingPriceForeign ?? 0,
        dto.sellingExchangeRate ?? 0,
      ),
    );
    return result;
  }

  @Patch(':orderId/items/:itemId')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update order item' })
  @ApiParam({ name: 'orderId' })
  @ApiParam({ name: 'itemId', description: 'Item id' })
  @ApiResponse({ status: 200 })
  async updateItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    const payload: UpdateOrderItemCommand['payload'] = {};
    if (dto.productName != null) payload.productName = dto.productName;
    if (dto.variant != null) payload.variant = dto.variant;
    if (dto.quantity != null) payload.quantity = dto.quantity;
    if (dto.purchasePrice != null) payload.purchasePrice = dto.purchasePrice;
    if (dto.purchaseExchangeRate != null) payload.purchaseExchangeRate = dto.purchaseExchangeRate;
    if (dto.discountType != null) payload.discountType = dto.discountType;
    if (dto.discountValue != null) payload.discountValue = dto.discountValue;
    if (dto.sellingPriceForeign != null) payload.sellingPriceForeign = dto.sellingPriceForeign;
    if (dto.sellingExchangeRate != null) payload.sellingExchangeRate = dto.sellingExchangeRate;
    await this.commandBus.execute(new UpdateOrderItemCommand(orderId, itemId, payload));
    return { success: true };
  }

  @Delete(':orderId/items/:itemId')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete order item' })
  @ApiParam({ name: 'orderId' })
  @ApiParam({ name: 'itemId', description: 'Item id' })
  @ApiResponse({ status: 200 })
  async deleteItem(@Param('orderId') orderId: string, @Param('itemId') itemId: string) {
    await this.commandBus.execute(new DeleteOrderItemCommand(orderId, itemId));
    return { success: true };
  }

  @Post(':id/calculate')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Recalculate order totals from items' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async calculate(@Param('id') id: string) {
    await this.commandBus.execute(new CalculateOrderCommand(id));
    return { success: true };
  }

  @Post(':id/close')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Close order' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async close(@Param('id') id: string) {
    await this.commandBus.execute(new CloseOrderCommand(id));
    return { success: true };
  }
}
