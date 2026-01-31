import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface ChannelProps {
  value: string;
}

const ALLOWED = ['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'] as const;

export class ChannelVO extends ValueObject<ChannelProps> {
  private constructor(props: ChannelProps) {
    super(props);
  }

  static create(value: string): ChannelVO {
    const v = value?.trim().toUpperCase();
    if (!ALLOWED.includes(v as (typeof ALLOWED)[number])) {
      throw new Error(`Invalid channel. Allowed: ${ALLOWED.join(', ')}`);
    }
    return new ChannelVO({ value: v });
  }

  get value(): string {
    return this.props.value;
  }
}
