import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendNotificationDto } from '../../../application/dto/send-notification.dto';
import { SendNotificationCommand } from '../../../application/commands/send-notification.command';
import { JwtAuthGuard } from '../../../../user-management/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from '../../../../user-management/infrastructure/external-services/roles.guard';
import { Roles } from '../../../../user-management/application/decorators/roles.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'STAFF', 'ADMIN', 'ACCOUNTANT', 'SUPERADMIN')
@ApiBearerAuth('BearerAuth')
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ status: 201, description: 'Notification sent' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async send(@Body() dto: SendNotificationDto) {
    await this.commandBus.execute(
      new SendNotificationCommand(
        dto.merchantId,
        dto.customerId,
        dto.type,
        dto.channel,
        dto.title,
        dto.body,
      ),
    );
    return { success: true };
  }
}
