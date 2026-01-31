import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordPaymentCommand } from './record-payment.command';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '../../domain/repositories/payment.repository';
import { PaymentAggregate } from '../../domain/aggregates/payment.aggregate';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(RecordPaymentCommand)
export class RecordPaymentHandler
  implements ICommandHandler<RecordPaymentCommand, PaymentAggregate>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repo: IPaymentRepository,
  ) {}

  async execute(command: RecordPaymentCommand): Promise<PaymentAggregate> {
    const aggregate = PaymentAggregate.create({
      id: generateUuid(),
      merchantId: command.merchantId,
      orderId: command.orderId,
      amount: command.amount,
      currency: command.currency,
      status: 'PAID',
      paidAt: command.paymentDate,
    });
    return this.repo.save(aggregate);
  }
}
