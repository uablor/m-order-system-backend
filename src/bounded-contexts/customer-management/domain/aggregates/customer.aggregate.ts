import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface CustomerAggregateProps extends EntityProps {
  merchantId: string;
  token: string;
  fullName: string;
  contactPhone?: string;
  contactEmail?: string;
}

export class CustomerAggregate extends AggregateRoot<CustomerAggregateProps> {
  private constructor(props: CustomerAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<CustomerAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CustomerAggregate {
    if (!props.merchantId?.trim()) throw new Error('Customer must belong to a merchant');
    if (!props.token?.trim()) throw new Error('Customer token is required');
    if (!props.fullName?.trim()) throw new Error('Full name is required');
    const phone = props.contactPhone?.trim();
    const email = props.contactEmail?.trim();
    if (!phone && !email) throw new Error('At least one contact method (phone or email) is required');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error('Invalid contact email format');
    return new CustomerAggregate({
      ...props,
      contactPhone: phone || undefined,
      contactEmail: email || undefined,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: CustomerAggregateProps): CustomerAggregate {
    return new CustomerAggregate(props);
  }

  get merchantId(): string {
    return this.props.merchantId;
  }

  get token(): string {
    return this.props.token;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get contactPhone(): string | undefined {
    return this.props.contactPhone;
  }

  get contactEmail(): string | undefined {
    return this.props.contactEmail;
  }

  updateContact(fullName: string, contactPhone?: string, contactEmail?: string): void {
    if (fullName?.trim()) (this.props as CustomerAggregateProps).fullName = fullName.trim();
    (this.props as CustomerAggregateProps).contactPhone = contactPhone?.trim() || undefined;
    (this.props as CustomerAggregateProps).contactEmail = contactEmail?.trim() || undefined;
    (this.props as CustomerAggregateProps).updatedAt = new Date();
  }
}
