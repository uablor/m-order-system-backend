import { DomainException } from '../../../../shared/domain/exceptions/domain-exception';

export class InvalidCurrencyException extends DomainException {
  constructor(message: string = 'Invalid currency') {
    super(message, 'INVALID_CURRENCY');
    this.name = 'InvalidCurrencyException';
  }
}
