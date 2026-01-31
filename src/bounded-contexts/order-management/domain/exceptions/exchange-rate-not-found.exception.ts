import { NotFoundException } from '../../../../shared/domain/exceptions/not-found-exception';

export class ExchangeRateNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(id ? `Exchange rate ${id} not found` : 'Exchange rate not found', 'EXCHANGE_RATE_NOT_FOUND');
    this.name = 'ExchangeRateNotFoundException';
  }
}
