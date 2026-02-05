import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyPaymentCommand } from './verify-payment.command';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain/repositories/payment.repository';
import { CUSTOMER_ORDER_REPOSITORY, type ICustomerOrderRepository } from '../../domain/repositories/customer-order.repository';

@CommandHandler(VerifyPaymentCommand)
export class VerifyPaymentHandler implements ICommandHandler<VerifyPaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(CUSTOMER_ORDER_REPOSITORY)
    private readonly customerOrderRepo: ICustomerOrderRepository,
  ) {}

  async execute(command: VerifyPaymentCommand): Promise<void> {
    const payment = await this.paymentRepo.findById(command.paymentId);
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING payment can be verified');
    }
    const { data: customerOrders } = await this.customerOrderRepo.findMany({
      merchantId: payment.merchantId,
      orderId: payment.orderId,
      customerId: payment.customerId,
      limit: 1,
    });
    const customerOrder = customerOrders[0];
    if (customerOrder) {
      customerOrder.recordPayment(payment.paymentAmount);
      await this.customerOrderRepo.save(customerOrder);
    }
    payment.verify(command.verifiedBy);
    await this.paymentRepo.save(payment);
  }
}
