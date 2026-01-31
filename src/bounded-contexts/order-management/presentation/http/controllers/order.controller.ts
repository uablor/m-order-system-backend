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
import { CreateOrderCommand } from '../../../application/commands/create-order.command';
import { GetOrderQuery } from '../../../application/queries/get-order.query';
import { ListOrdersQuery } from '../../../application/queries/list-orders.query';
import { GetOrderProfitQuery } from '../../../application/queries/get-order-profit.query';
import { JwtAuthGuard } from '../../../../user-management/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../../user-management/infrastructure/external-services/roles.guard';
import { Roles } from '../../../../user-management/application/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT', 'SUPERADMIN')
@ApiBearerAuth('BearerAuth')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id/profit')
  @ApiOperation({ summary: 'Get order profit' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiResponse({ status: 200, description: 'Order profit' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getProfit(
    @Param('id') id: string,
    @Query('merchantId') merchantId: string,
  ) {
    return this.queryBus.execute(new GetOrderProfitQuery(id, merchantId));
  }
}
