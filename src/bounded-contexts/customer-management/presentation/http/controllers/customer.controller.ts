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
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Roles } from 'src/bounded-contexts/identity-access/application/decorators/roles.decorator';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
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
  @ApiOperation({ summary: 'List customers' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(
      new ListCustomersQuery(merchantId, page ? Number(page) : undefined, limit ? Number(limit) : undefined),
    );
  }

  @Get('token/:token')
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
  @ApiOperation({ summary: 'Get customer by id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCustomerQuery(id));
  }

  @Patch(':id')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
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
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteCustomerCommand(id));
    return { success: true };
  }
}
