import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface EmailProps {
  value: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(value: string): Email {
    const trimmed = value?.trim() ?? '';
    if (!trimmed) throw new Error('Email is required');
    if (!EMAIL_REGEX.test(trimmed)) throw new Error('Invalid email format');
    return new Email({ value: trimmed.toLowerCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
