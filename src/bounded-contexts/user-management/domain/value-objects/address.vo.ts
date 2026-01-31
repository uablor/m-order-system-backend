// shop-address.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

interface AddressProps {
  value: string;
}

export class Address extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
  } 

  static create(address: string): Address {
    if (!address || address.trim().length === 0) {
      throw new Error('Address is required');
    }
    return new Address({ value: address.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
