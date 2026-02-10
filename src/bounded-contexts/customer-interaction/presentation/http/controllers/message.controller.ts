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
import { CreateMessageCommand } from '../../../application/commands/create-message.command';
import { MarkMessageReadCommand } from '../../../application/commands/mark-message-read.command';
import { GetMessageQuery } from '../../../application/queries/get-message.query';
import { ListMessagesQuery } from '../../../application/queries/list-messages.query';
import { CreateMessageDto } from '../../../application/dto/create-message.dto';
import { PaginationQuery, type PaginationQueryParams } from '@shared/application/pagination';
import { JwtAuthGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/jwt-auth.guard';
import { RolesGuard } from 'src/bounded-contexts/identity-access/infrastructure/external-services/roles.guard';
import { Permissions } from 'src/bounded-contexts/identity-access/application/decorators/permissions.decorator';
import { AutoPermissions } from 'src/bounded-contexts/identity-access/application/decorators/auto-permissions.decorator';

@ApiTags('Customer Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
@AutoPermissions({ resource: 'message' })
@ApiBearerAuth('BearerAuth')
export class MessageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Permissions('message.create')
  @ApiOperation({ summary: 'Create customer message (must belong to merchant + customer)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateMessageDto) {
    const aggregate = await this.commandBus.execute(
      new CreateMessageCommand(
        dto.customerId,
        dto.merchantId,
        dto.messageType,
        dto.messageContent,
        dto.orderId,
        dto.fileUrl,
      ),
    );
    return { id: aggregate.id.value };
  }

  @Get()
  @Permissions('message.list')
  @ApiOperation({ summary: 'List customer messages' })
  @ApiQuery({ name: 'merchantId', required: true })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('merchantId') merchantId: string,
    @Query('customerId') customerId: string | undefined,
    @Query('orderId') orderId: string | undefined,
    @PaginationQuery() pagination: PaginationQueryParams,
  ) {
    return this.queryBus.execute(
      new ListMessagesQuery(
        merchantId,
        customerId,
        orderId,
        pagination.page,
        pagination.limit,
      ),
    );
  }

  @Get(':id')
  @Permissions('message.read')
  @ApiOperation({ summary: 'Get message by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetMessageQuery(id));
  }

  @Patch(':id/read')
  @Permissions('message.update')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async markRead(@Param('id') id: string) {
    await this.commandBus.execute(new MarkMessageReadCommand(id));
    return { success: true };
  }
}
