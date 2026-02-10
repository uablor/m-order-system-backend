import {
  Body,
  Controller,
  Delete,
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
import { CreateCustomerOrderCommand } from '../../../application/commands/create-customer-order.command';
import { AddCustomerOrderItemCommand } from '../../../application/commands/add-customer-order-item.command';
import { DeleteCustomerOrderCommand } from '../../../application/commands/delete-customer-order.command';
import { GetCustomerOrderQuery } from '../../../application/queries/get-customer-order.query';
import { ListCustomerOrdersQuery } from '../../../application/queries/list-customer-orders.query';
import { ListDraftCustomerOrdersQuery } from '../../../application/queries/list-draft-customer-orders.query';
import { CreateCustomerOrderDto } from '../../../application/dto/create-customer-order.dto';
import { AddCustomerOrderItemDto } from '../../../application/dto/add-customer-order-item.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Permissions } from 'src/bounded-contexts/identity-access/application/decorators/permissions.decorator';
import { AutoPermissions } from 'src/bounded-contexts/identity-access/application/decorators/auto-permissions.decorator';

@ApiTags('Customer Orders')
@Controller('customer-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'customer_order' })
@ApiBearerAuth('BearerAuth')
export class CustomerOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('customer_order.create')
  @ApiOperation({ summary: 'Create customer order (must belong to order)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateCustomerOrderDto) {
    const aggregate = await this.commandBus.execute(
      new CreateCustomerOrderCommand(dto.orderId, dto.customerId, dto.merchantId),
    );
    return { id: aggregate.id.value };
  }

  @Get()
  @Permissions('customer_order.list')
  @ApiOperation({ summary: 'List customer orders' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('orderId') orderId: string | undefined,
    @Query('customerId') customerId: string | undefined,
    @PaginationQuery() pagination: PaginationQueryParams,
  ) {
    return this.queryBus.execute(
      new ListCustomerOrdersQuery(
        merchantId,
        orderId,
        customerId,
        pagination.page,
        pagination.limit,
      ),
    );
  }

  @Get('drafts')
  @Permissions('customer_order.list')
  @ApiOperation({ summary: 'List draft customer orders by customer' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'customerId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async listDrafts(
    @Query('merchantId') merchantId: string,
    @Query('customerId') customerId: string,
    @PaginationQuery() pagination: PaginationQueryParams,
  ) {
    return this.queryBus.execute(
      new ListDraftCustomerOrdersQuery(
        merchantId,
        customerId,
        pagination.page,
        pagination.limit,
      ),
    );
  }

  @Get(':id')
  @Permissions('customer_order.read')
  @ApiOperation({ summary: 'Get customer order by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCustomerOrderQuery(id));
  }

  @Post(':id/items')
  @Permissions('customer_order.add_items')
  @ApiOperation({ summary: 'Add customer order item (allocate from order item)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 201 })
  async addItem(@Param('id') id: string, @Body() dto: AddCustomerOrderItemDto) {
    const result = await this.commandBus.execute(
      new AddCustomerOrderItemCommand(
        id,
        dto.orderItemId,
        dto.quantity,
        dto.sellingPriceForeign,
        dto.sellingExchangeRate,
      ),
    );
    return result;
  }

  @Delete(':id')
  @Permissions('customer_order.delete')
  @ApiOperation({ summary: 'Delete customer order' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteCustomerOrderCommand(id));
    return { success: true };
  }
}
