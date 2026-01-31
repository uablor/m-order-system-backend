import { ValueObject } from '../../../../shared/domain/value-objects';

interface OrderStatusProps {
  value: string;
}

const ALLOWED_STATUSES = ['PENDING', 'ARRIVED', 'NOTIFIED', 'CANCELLED'];

export class OrderStatus extends ValueObject<OrderStatusProps> {
  private constructor(props: OrderStatusProps) {
    super(props);
  }

  static create(value: string): OrderStatus {
    const normalized = value?.trim().toUpperCase() ?? '';
    if (!ALLOWED_STATUSES.includes(normalized)) {
      throw new Error(`Invalid order status: ${value}`);
    }
    return new OrderStatus({ value: normalized });
  }

  get value(): string {
    return this.props.value;
  }
}
