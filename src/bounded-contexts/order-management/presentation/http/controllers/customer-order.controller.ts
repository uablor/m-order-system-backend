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
import { CreateCustomerOrderDto } from '../../../application/dto/create-customer-order.dto';
import { AddCustomerOrderItemDto } from '../../../application/dto/add-customer-order-item.dto';
import { CreateCustomerOrderCommand } from '../../../application/commands/create-customer-order.command';
import { AddCustomerOrderItemCommand } from '../../../application/commands/add-customer-order-item.command';
import { GetCustomerOrderQuery } from '../../../application/queries/get-customer-order.query';
import { ListCustomerOrdersQuery } from '../../../application/queries/list-customer-orders.query';
import { JwtAuthGuard } from '../../../../user-management/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../../user-management/infrastructure/external-services/roles.guard';
import { Roles } from '../../../../user-management/application/decorators/roles.decorator';

@ApiTags('Customer Orders')
@Controller('customer-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT', 'SUPERADMIN')
@ApiBearerAuth('BearerAuth')
export class CustomerOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create customer order' })
  @ApiResponse({ status: 201, description: 'Customer order created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateCustomerOrderDto) {
    const order = await this.commandBus.execute(
      new CreateCustomerOrderCommand(
        dto.merchantId,
        dto.customerId,
        dto.orderCode,
        new Date(dto.orderDate),
        dto.totalAmount,
        dto.currency,
        dto.orderId,
      ),
    );
    return {
      id: order.id,
      merchantId: order.merchantId,
      customerId: order.customerId,
      orderCode: order.orderCode,
      orderDate: order.orderDate,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
    };
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to customer order' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Item added' })
  @ApiResponse({ status: 404, description: 'Customer order not found' })
  async addItem(@Param('id') id: string, @Body() dto: AddCustomerOrderItemDto) {
    await this.commandBus.execute(
      new AddCustomerOrderItemCommand(
        id,
        dto.merchantId,
        dto.productRef,
        dto.quantity,
        dto.unitPrice,
        dto.currency,
      ),
    );
    return { success: true };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer order by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Customer order found' })
  @ApiResponse({ status: 404, description: 'Customer order not found' })
  async getById(@Param('id') id: string) {
    const order = await this.queryBus.execute(new GetCustomerOrderQuery(id));
    if (!order) {
      return { data: null };
    }
    return {
      id: order.id,
      merchantId: order.merchantId,
      customerId: order.customerId,
      orderId: order.orderId,
      orderCode: order.orderCode,
      orderDate: order.orderDate,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      items: order.items.map((i) => ({
        id: i.id,
        productRef: i.productRef,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
        currency: i.currency,
      })),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List customer orders' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Customer orders list' })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('customerId') customerId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(
      new ListCustomerOrdersQuery(
        merchantId,
        customerId,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined,
      ),
    );
  }
}
