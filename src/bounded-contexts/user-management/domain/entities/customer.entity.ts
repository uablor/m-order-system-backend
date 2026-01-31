import { UniqueEntityId } from 'src/shared/domain/value-objects';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';
import { FullName } from '../value-objects/full-name.vo';
import { Email } from '../value-objects';
import { ContactPhone } from '../value-objects/contact-phone.vo';
import { Address } from '../value-objects/address.vo';

export interface CustomerEntityProps extends EntityProps {
  merchantId: UniqueEntityId;
  name: FullName;
  phone?: ContactPhone;
  email?: Email;
  address?: Address;
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

  get merchantId(): UniqueEntityId {
    return this.props.merchantId;
  }
  get name(): FullName {
    return this.props.name;
  }
  get phone(): ContactPhone | undefined {
    return this.props.phone;
  }
  get email(): Email | undefined {
    return this.props.email;
  }
  get address(): Address | undefined {
    return this.props.address;
  }
}
