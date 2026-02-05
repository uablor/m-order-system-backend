import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { MessageType } from '../value-objects/message-type.vo';

export interface CustomerMessageAggregateProps extends EntityProps {
  customerId: string;
  merchantId: string;
  orderId?: string;
  messageType: MessageType;
  messageContent: string;
  fileUrl?: string;
  isRead: boolean;
  readAt?: Date;
}

export class CustomerMessageAggregate extends AggregateRoot<CustomerMessageAggregateProps> {
  private constructor(props: CustomerMessageAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<CustomerMessageAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CustomerMessageAggregate {
    if (!props.customerId?.trim()) throw new Error('Customer is required');
    if (!props.merchantId?.trim()) throw new Error('Merchant is required');
    const validTypes: MessageType[] = ['TEXT', 'IMAGE'];
    if (!validTypes.includes(props.messageType)) throw new Error('Invalid message type');
    return new CustomerMessageAggregate({
      ...props,
      isRead: props.isRead ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: CustomerMessageAggregateProps): CustomerMessageAggregate {
    return new CustomerMessageAggregate(props);
  }

  get customerId(): string {
    return this.props.customerId;
  }
  get merchantId(): string {
    return this.props.merchantId;
  }
  get orderId(): string | undefined {
    return this.props.orderId;
  }
  get messageType(): MessageType {
    return this.props.messageType;
  }
  get messageContent(): string {
    return this.props.messageContent;
  }
  get fileUrl(): string | undefined {
    return this.props.fileUrl;
  }
  get isRead(): boolean {
    return this.props.isRead;
  }
  get readAt(): Date | undefined {
    return this.props.readAt;
  }

  markRead(): void {
    (this.props as CustomerMessageAggregateProps).isRead = true;
    (this.props as CustomerMessageAggregateProps).readAt = new Date();
    (this.props as CustomerMessageAggregateProps).updatedAt = new Date();
  }
}
