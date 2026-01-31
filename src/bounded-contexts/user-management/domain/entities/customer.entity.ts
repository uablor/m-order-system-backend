import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export interface CustomerEntityProps extends EntityProps {
  merchantId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export class CustomerEntity extends Entity<CustomerEntityProps> {
  private constructor(props: CustomerEntityProps) {
    super(props);
  }

  static create(
    props: Omit<CustomerEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CustomerEntity {
    return new CustomerEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get name(): string {
    return this.props.name;
  }
  get phone(): string | undefined {
    return this.props.phone;
  }
  get email(): string | undefined {
    return this.props.email;
  }
  get address(): string | undefined {
    return this.props.address;
  }
}
