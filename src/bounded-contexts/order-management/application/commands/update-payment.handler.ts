import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePaymentCommand } from './update-payment.command';
import { PAYMENT_REPOSITORY, type IPaymentRepository } from '../../domain/repositories/payment.repository';

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler implements ICommandHandler<UpdatePaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repo: IPaymentRepository,
  ) {}

  async execute(command: UpdatePaymentCommand): Promise<void> {
    const payment = await this.repo.findById(command.id);
    if (!payment) throw new NotFoundException('Payment not found');
    if (command.payload.notes != null) payment.updateNotes(command.payload.notes);
    await this.repo.save(payment);
  }
}
