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
import { CreateCustomerCommand } from '../../../application/commands/create-customer.command';
import { UpdateCustomerCommand } from '../../../application/commands/update-customer.command';
import { DeleteCustomerCommand } from '../../../application/commands/delete-customer.command';
import { GetCustomerQuery } from '../../../application/queries/get-customer.query';
import { GetCustomerByTokenQuery } from '../../../application/queries/get-customer-by-token.query';
import { ListCustomersQuery } from '../../../application/queries/list-customers.query';
import { CreateCustomerDto } from '../../../application/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../../application/dto/update-customer.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Permissions } from 'src/bounded-contexts/identity-access/application/decorators/permissions.decorator';
import { AutoPermissions } from 'src/bounded-contexts/identity-access/application/decorators/auto-permissions.decorator';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'customer' })
@ApiBearerAuth('BearerAuth')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('customer.create')
  @ApiOperation({ summary: 'Create customer (generates unique token)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.commandBus.execute(
      new CreateCustomerCommand(
        dto.merchantId,
        dto.fullName,
        dto.contactPhone,
        dto.contactEmail,
      ),
    );
    return { id: customer.id.value, token: customer.token };
  }

  @Get()
  @Permissions('customer.list')
  @ApiOperation({ summary: 'List customers' })
  @ApiQuery({ name: 'merchantId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(

    @PaginationQuery() pagination: PaginationQueryParams,
    @Query('merchantId') merchantId?: string,
  ) {
    return this.queryBus.execute(
      new ListCustomersQuery(merchantId, pagination.page, pagination.limit),
    );
  }

  @Get('token/:token')
  @Permissions('customer.read')
  @ApiOperation({ summary: 'Get customer by token' })
  @ApiParam({ name: 'token' })
  @ApiQuery({ name: 'merchantId', required: false })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getByToken(
    @Param('token') token: string,
    @Query('merchantId') merchantId?: string,
  ) {
    return this.queryBus.execute(new GetCustomerByTokenQuery(token, merchantId));
  }

  @Get(':id')
  @Permissions('customer.read')
  @ApiOperation({ summary: 'Get customer by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCustomerQuery(id));
  }

  @Patch(':id')
  @Permissions('customer.update')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    const payload: UpdateCustomerCommand['payload'] = {};
    if (dto.fullName != null) payload.fullName = dto.fullName;
    if (dto.contactPhone !== undefined) payload.contactPhone = dto.contactPhone;
    if (dto.contactEmail !== undefined) payload.contactEmail = dto.contactEmail;
    await this.commandBus.execute(new UpdateCustomerCommand(id, payload));
    return { success: true };
  }

  @Delete(':id')
  @Permissions('customer.delete')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteCustomerCommand(id));
    return { success: true };
  }
}
