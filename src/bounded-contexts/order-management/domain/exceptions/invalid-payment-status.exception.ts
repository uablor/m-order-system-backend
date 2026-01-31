import { DomainException } from '../../../../shared/domain/exceptions/domain-exception';

export class InvalidPaymentStatusException extends DomainException {
  constructor(message: string = 'Invalid payment status') {
    super(message, 'INVALID_PAYMENT_STATUS');
    this.name = 'InvalidPaymentStatusException';
  }
}
