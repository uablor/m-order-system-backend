import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export interface CustomerMessageProps extends EntityProps {
  customerOrderId: string;
  content: string;
  channel: string;
  sentAt: Date;
}

export class CustomerMessageEntity extends Entity<CustomerMessageProps> {
  private constructor(props: CustomerMessageProps) {
    super(props);
  }

  static create(props: CustomerMessageProps): CustomerMessageEntity {
    return new CustomerMessageEntity(props);
  }

  get customerOrderId(): string {
    return this.props.customerOrderId;
  }
  get content(): string {
    return this.props.content;
  }
  get channel(): string {
    return this.props.channel;
  }
  get sentAt(): Date {
    return this.props.sentAt;
  }
}
