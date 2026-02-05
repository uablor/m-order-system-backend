import {
  Body,
  Controller,
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
import { CreatePaymentCommand } from '../../../application/commands/create-payment.command';
import { UpdatePaymentCommand } from '../../../application/commands/update-payment.command';
import { VerifyPaymentCommand } from '../../../application/commands/verify-payment.command';
import { RejectPaymentCommand } from '../../../application/commands/reject-payment.command';
import { GetPaymentQuery } from '../../../application/queries/get-payment.query';
import { ListPaymentsQuery } from '../../../application/queries/list-payments.query';
import { CreatePaymentDto } from '../../../application/dto/create-payment.dto';
import { UpdatePaymentDto } from '../../../application/dto/update-payment.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Roles } from 'src/bounded-contexts/identity-access/application/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create payment (PENDING)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreatePaymentDto) {
    const aggregate = await this.commandBus.execute(
      new CreatePaymentCommand(
        dto.orderId,
        dto.merchantId,
        dto.customerId,
        dto.paymentAmount,
        dto.paymentDate,
        dto.paymentMethod,
        dto.paymentProofUrl,
        dto.paymentAt,
        dto.customerMessage,
      ),
    );
    return { id: aggregate.id.value };
  }

  @Get()
  @ApiOperation({ summary: 'List payments' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('orderId') orderId: string | undefined,
    @Query('customerId') customerId: string | undefined,
    @Query('status') status: string | undefined,
    @PaginationQuery() pagination: PaginationQueryParams,
  ) {
    return this.queryBus.execute(
      new ListPaymentsQuery(
        merchantId,
        orderId,
        customerId,
        status,
        pagination.page,
        pagination.limit,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetPaymentQuery(id));
  }

  @Patch(':id')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Update payment (e.g. notes)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    const payload: UpdatePaymentCommand['payload'] = {};
    if (dto.notes != null) payload.notes = dto.notes;
    await this.commandBus.execute(new UpdatePaymentCommand(id, payload));
    return { success: true };
  }

  @Post(':id/verify')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Verify payment (updates customer order balance)' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'verifiedBy', required: true })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Only PENDING can be verified' })
  async verify(@Param('id') id: string, @Query('verifiedBy') verifiedBy: string) {
    await this.commandBus.execute(new VerifyPaymentCommand(id, verifiedBy));
    return { success: true };
  }

  @Post(':id/reject')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Reject payment (cannot reject verified)' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'rejectedBy', required: true })
  @ApiQuery({ name: 'reason', required: false })
  @ApiResponse({ status: 200 })
  async reject(
    @Param('id') id: string,
    @Query('rejectedBy') rejectedBy: string,
    @Query('reason') reason?: string,
  ) {
    await this.commandBus.execute(new RejectPaymentCommand(id, rejectedBy, reason));
    return { success: true };
  }
}
