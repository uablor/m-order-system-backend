import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArrivalCommand } from './create-arrival.command';
import { ARRIVAL_REPOSITORY, type IArrivalRepository } from '../../domain/repositories/arrival.repository';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { ArrivalAggregate } from '../../domain/aggregates/arrival.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateArrivalCommand)
export class CreateArrivalHandler implements ICommandHandler<CreateArrivalCommand> {
  constructor(
    @Inject(ARRIVAL_REPOSITORY)
    private readonly repo: IArrivalRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: CreateArrivalCommand): Promise<ArrivalAggregate> {
    const order = await this.orderRepo.findById(command.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const arrivedDate = new Date(command.arrivedDate);
    const aggregate = ArrivalAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      orderId: command.orderId,
      merchantId: command.merchantId,
      arrivedDate,
      arrivedTime: command.arrivedTime,
      recordedBy: command.recordedBy,
      notes: command.notes,
      status: 'PENDING',
    });
    return this.repo.save(aggregate);
  }
}
