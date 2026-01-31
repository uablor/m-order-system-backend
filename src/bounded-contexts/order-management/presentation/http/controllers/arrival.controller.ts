import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecordArrivalDto } from '../../../application/dto/record-arrival.dto';
import { RecordArrivalCommand } from '../../../application/commands/record-arrival.command';
import { JwtAuthGuard } from '../../../../user-management/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../../user-management/infrastructure/external-services/roles.guard';
import { Roles } from '../../../../user-management/application/decorators/roles.decorator';

@ApiTags('Arrivals')
@Controller('arrivals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT')
@ApiBearerAuth('BearerAuth')
export class ArrivalController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Record arrival' })
  @ApiResponse({ status: 201, description: 'Arrival recorded' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async record(@Body() dto: RecordArrivalDto) {
    const arrival = await this.commandBus.execute(
      new RecordArrivalCommand(
        dto.orderId,
        new Date(dto.arrivalDate),
        dto.items.map((i) => ({
          orderItemId: i.orderItemId,
          quantityReceived: i.quantityReceived,
          condition: i.condition,
        })),
        dto.notes,
      ),
    );
    return {
      id: arrival.id,
      orderId: arrival.orderId,
      arrivalDate: arrival.arrivalDate,
      status: arrival.status,
      notes: arrival.notes,
      items: arrival.items.map((i) => ({
        id: i.id,
        orderItemId: i.orderItemId,
        quantityReceived: i.quantityReceived,
        condition: i.condition,
      })),
    };
  }
}
