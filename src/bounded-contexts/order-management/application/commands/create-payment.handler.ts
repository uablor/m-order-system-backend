import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from './create-payment.command';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { PaymentAggregate } from '../../domain/aggregates/payment.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<PaymentAggregate> {
    const order = await this.orderRepo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const paymentDate = new Date(command.paymentDate);
    const aggregate = PaymentAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      orderId: command.orderId,
      merchantId: command.merchantId,
      customerId: command.customerId,
      paymentAmount: command.paymentAmount,
      paymentDate,
      paymentMethod: command.paymentMethod,
      paymentProofUrl: command.paymentProofUrl,
      paymentAt: command.paymentAt ? new Date(command.paymentAt) : undefined,
      customerMessage: command.customerMessage,
      status: 'PENDING',
    });
    return this.paymentRepo.save(aggregate);
  }
}
