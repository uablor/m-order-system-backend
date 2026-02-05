import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RejectPaymentCommand } from './reject-payment.command';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain/repositories/payment.repository';

@CommandHandler(RejectPaymentCommand)
export class RejectPaymentHandler implements ICommandHandler<RejectPaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repo: IPaymentRepository,
  ) {}

  async execute(command: RejectPaymentCommand): Promise<void> {
    const payment = await this.repo.findById(command.paymentId);
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === 'VERIFIED') {
      throw new BadRequestException('Cannot reject already verified payment');
    }
    payment.reject(command.rejectedBy, command.reason);
    await this.repo.save(payment);
  }
}
