import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMessagesQuery } from './list-messages.query';
import {
  CUSTOMER_MESSAGE_REPOSITORY,
  type ICustomerMessageRepository,
} from '../../domain/repositories/customer-message.repository';
import {
  buildPaginationMeta,
  normalizePaginationParams,
} from '../../../../shared/infrastructure/persistence/pagination';

@QueryHandler(ListMessagesQuery)
export class ListMessagesHandler implements IQueryHandler<ListMessagesQuery> {
  constructor(
    @Inject(CUSTOMER_MESSAGE_REPOSITORY)
    private readonly repo: ICustomerMessageRepository,
  ) {}

  async execute(query: ListMessagesQuery) {
    const { data, total } = await this.repo.findMany({
      merchantId: query.merchantId,
      customerId: query.customerId,
      orderId: query.orderId,
      page: query.page,
      limit: query.limit,
    });
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const pagination = buildPaginationMeta(total, page, limit, data.length);
    return {
      data: data.map((a) => ({
        id: a.id.value,
        customerId: a.customerId,
        merchantId: a.merchantId,
        orderId: a.orderId,
        messageType: a.messageType,
        messageContent: a.messageContent,
        isRead: a.isRead,
        readAt: a.readAt,
        createdAt: a.createdAt,
      })),
      pagination,
    };
  }
}
