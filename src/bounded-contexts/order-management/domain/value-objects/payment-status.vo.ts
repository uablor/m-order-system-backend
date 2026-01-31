import { ValueObject } from '../../../../shared/domain/value-objects/value-object';

interface PaymentStatusProps {
  value: string;
}

const ALLOWED = ['UNPAID', 'PARTIAL', 'PAID', 'VERIFIED', 'REJECTED'] as const;

export type PaymentStatusValue = (typeof ALLOWED)[number];

export class PaymentStatusVO extends ValueObject<PaymentStatusProps> {
  private constructor(props: PaymentStatusProps) {
    super(props);
  }

  static create(value: string): PaymentStatusVO {
    const v = value?.trim().toUpperCase();
    if (!ALLOWED.includes(v as PaymentStatusValue)) {
      throw new Error(`Invalid payment status. Allowed: ${ALLOWED.join(', ')}`);
    }
    return new PaymentStatusVO({ value: v });
  }

  get value(): string {
    return this.props.value;
  }
}
