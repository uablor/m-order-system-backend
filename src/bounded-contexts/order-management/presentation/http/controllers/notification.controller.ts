import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNotificationCommand } from '../../../application/commands/create-notification.command';
import { RetryNotificationCommand } from '../../../application/commands/retry-notification.command';
import { GetNotificationQuery } from '../../../application/queries/get-notification.query';
import { ListNotificationsQuery } from '../../../application/queries/list-notifications.query';
import { CreateNotificationDto } from '../../../application/dto/create-notification.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Roles } from 'src/bounded-contexts/identity-access/application/decorators/roles.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('BearerAuth')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Create notification (event-driven record)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateNotificationDto) {
    const result = await this.commandBus.execute(
      new CreateNotificationCommand(
        dto.merchantId,
        dto.customerId,
        dto.notificationType,
        dto.channel,
        dto.recipientContact,
        dto.messageContent,
        dto.notificationLink,
        dto.relatedOrders,
      ),
    );
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'List notifications' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'notificationType', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('customerId') customerId: string | undefined,
    @Query('notificationType') notificationType: string | undefined,
    @Query('status') status: string | undefined,
    @PaginationQuery() pagination: PaginationQueryParams,
  ) {
    return this.queryBus.execute(
      new ListNotificationsQuery(
        merchantId,
        customerId,
        notificationType,
        status,
        pagination.page,
        pagination.limit,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetNotificationQuery(id));
  }

  @Post(':id/retry')
  @Roles('OWNER', 'STAFF', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Retry notification (max retry limit applies)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Max retry limit reached' })
  async retry(@Param('id') id: string) {
    await this.commandBus.execute(new RetryNotificationCommand(id));
    return { success: true };
  }
}
