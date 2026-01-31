import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordPaymentDto } from '../../../application/dto/record-payment.dto';
import { RecordPaymentCommand } from '../../../application/commands/record-payment.command';
import { JwtAuthGuard } from '../../../../user-management/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../../user-management/infrastructure/external-services/roles.guard';
import { Roles } from '../../../../user-management/application/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT', 'SUPERADMIN')
@ApiBearerAuth('BearerAuth')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Record payment' })
  @ApiResponse({ status: 201, description: 'Payment recorded' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async record(@Body() dto: RecordPaymentDto) {
    const payment = await this.commandBus.execute(
      new RecordPaymentCommand(
        dto.merchantId,
        dto.orderId,
        dto.amount,
        dto.currency,
        new Date(dto.paymentDate),
        dto.customerOrderId,
        dto.reference,
      ),
    );
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paidAt: payment.paidAt,
    };
  }
}
