import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../../application/dto/create-customer.dto';
import { CreateCustomerCommand } from '../../../application/commands/create-customer.command';
import { GetCustomerQuery } from '../../../application/queries/get-customer.query';
import { ListCustomersByMerchantQuery } from '../../../application/queries/list-customers-by-merchant.query';
import { JwtAuthGuard } from '../../../infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/external-services/roles.guard';
import { Roles } from '../../../application/decorators/roles.decorator';

@ApiTags('Customer')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT')
@ApiBearerAuth('BearerAuth')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.commandBus.execute(
      new CreateCustomerCommand(
        dto.merchantId,
        dto.name,
        dto.phone,
        dto.email,
        dto.address,
      ),
    );
    return this.toResponse(customer);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'List customers by merchant' })
  @ApiParam({ name: 'merchantId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Customers list' })
  async listByMerchant(@Param('merchantId') merchantId: string) {
    const customers = await this.queryBus.execute(
      new ListCustomersByMerchantQuery(merchantId),
    );
    return customers.map((c: { id: string; merchantId: string; name: string; phone?: string; email?: string; address?: string }) =>
      this.toResponse(c),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Customer by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Customer' })
  async get(@Param('id') id: string) {
    const customer = await this.queryBus.execute(new GetCustomerQuery(id));
    return this.toResponse(customer);
  }

  private toResponse(customer: {
    id: string;
    merchantId: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    return {
      id: customer.id,
      merchantId: customer.merchantId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    };
  }
}
