import { DomainException } from '../../../../shared/domain/exceptions/domain-exception';

export class InvalidExchangeRateException extends DomainException {
  constructor(message: string = 'Invalid exchange rate') {
    super(message, 'INVALID_EXCHANGE_RATE');
    this.name = 'InvalidExchangeRateException';
  }
}
