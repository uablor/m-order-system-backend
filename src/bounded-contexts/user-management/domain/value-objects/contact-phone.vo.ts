// contact-phone.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

interface ContactPhoneProps {
  value: string;
}

export class ContactPhone extends ValueObject<ContactPhoneProps> {
  private constructor(props: ContactPhoneProps) {
    super(props);
  }

  static create(phone: string): ContactPhone {
    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      throw new Error('Invalid phone number');
    }
    return new ContactPhone({ value: phone });
  }

  get value(): string {
    return this.props.value;
  }
}
