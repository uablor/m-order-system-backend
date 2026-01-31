import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface OrderEntityProps extends EntityProps {
  merchantId: string;
  createdBy: string;
  orderCode: string;
  orderDate: Date;
  arrivalStatus: string;
  totalFinalCostLak: number;
  totalFinalCostThb: number;
  totalSellingAmountLak: number;
  totalSellingAmountThb: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
}

export class OrderEntity extends AggregateRoot<OrderEntityProps> {
  private constructor(props: OrderEntityProps) {
    super(props);
  }

  static create(
    props: Omit<OrderEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): OrderEntity {
    return new OrderEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get merchantId(): string {
    return this.props.merchantId;
  }
  get createdBy(): string {
    return this.props.createdBy;
  }
  get orderCode(): string {
    return this.props.orderCode;
  }
  get orderDate(): Date {
    return this.props.orderDate;
  }
  get arrivalStatus(): string {
    return this.props.arrivalStatus;
  }
  get totalFinalCostLak(): number {
    return this.props.totalFinalCostLak;
  }
  get totalFinalCostThb(): number {
    return this.props.totalFinalCostThb;
  }
  get totalSellingAmountLak(): number {
    return this.props.totalSellingAmountLak;
  }
  get totalSellingAmountThb(): number {
    return this.props.totalSellingAmountThb;
  }
  get paidAmount(): number {
    return this.props.paidAmount;
  }
  get remainingAmount(): number {
    return this.props.remainingAmount;
  }
  get paymentStatus(): string {
    return this.props.paymentStatus;
  }
}
