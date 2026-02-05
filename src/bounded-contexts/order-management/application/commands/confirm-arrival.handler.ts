import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmArrivalCommand } from './confirm-arrival.command';
import { ARRIVAL_REPOSITORY, type IArrivalRepository } from '../../domain/repositories/arrival.repository';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';

@CommandHandler(ConfirmArrivalCommand)
export class ConfirmArrivalHandler implements ICommandHandler<ConfirmArrivalCommand> {
  constructor(
    @Inject(ARRIVAL_REPOSITORY)
    private readonly arrivalRepo: IArrivalRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: ConfirmArrivalCommand): Promise<void> {
    const arrival = await this.arrivalRepo.findById(command.arrivalId);
    if (!arrival) throw new NotFoundException('Arrival not found');
    arrival.confirm();
    await this.arrivalRepo.save(arrival);
    const order = await this.orderRepo.findById(arrival.orderId);
    if (order) {
      order.markArrived();
      await this.orderRepo.save(order);
    }
  }
}
