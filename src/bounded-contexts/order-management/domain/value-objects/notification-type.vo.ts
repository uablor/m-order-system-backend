import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface NotificationTypeProps {
  value: string;
}

const ALLOWED = ['ORDER', 'PAYMENT', 'ARRIVAL', 'ALERT', 'SYSTEM'] as const;

export class NotificationTypeVO extends ValueObject<NotificationTypeProps> {
  private constructor(props: NotificationTypeProps) {
    super(props);
  }

  static create(value: string): NotificationTypeVO {
    const v = value?.trim().toUpperCase();
    if (!ALLOWED.includes(v as (typeof ALLOWED)[number])) {
      throw new Error(`Invalid notification type. Allowed: ${ALLOWED.join(', ')}`);
    }
    return new NotificationTypeVO({ value: v });
  }

  get value(): string {
    return this.props.value;
  }
}
