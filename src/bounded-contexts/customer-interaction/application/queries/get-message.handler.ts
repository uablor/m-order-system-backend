import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessageQuery } from './get-message.query';
import {
  CUSTOMER_MESSAGE_REPOSITORY,
  type ICustomerMessageRepository,
} from '../../domain/repositories/customer-message.repository';

@QueryHandler(GetMessageQuery)
export class GetMessageHandler implements IQueryHandler<GetMessageQuery> {
  constructor(
    @Inject(CUSTOMER_MESSAGE_REPOSITORY)
    private readonly repo: ICustomerMessageRepository,
  ) {}

  async execute(query: GetMessageQuery) {
    const aggregate = await this.repo.findById(query.id);
    if (!aggregate) return null;
    return {
      id: aggregate.id.value,
      customerId: aggregate.customerId,
      merchantId: aggregate.merchantId,
      orderId: aggregate.orderId,
      messageType: aggregate.messageType,
      messageContent: aggregate.messageContent,
      fileUrl: aggregate.fileUrl,
      isRead: aggregate.isRead,
      readAt: aggregate.readAt,
      createdAt: aggregate.createdAt,
    };
  }
}
