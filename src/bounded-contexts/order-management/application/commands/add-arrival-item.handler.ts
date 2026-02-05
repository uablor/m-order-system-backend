import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddArrivalItemCommand } from './add-arrival-item.command';
import { ARRIVAL_REPOSITORY, type IArrivalRepository } from '../../domain/repositories/arrival.repository';
import { ORDER_REPOSITORY, type IOrderRepository } from '../../domain/repositories/order.repository';
import { ArrivalItemEntity } from '../../domain/entities/arrival-item.entity';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(AddArrivalItemCommand)
export class AddArrivalItemHandler implements ICommandHandler<AddArrivalItemCommand> {
  constructor(
    @Inject(ARRIVAL_REPOSITORY)
    private readonly arrivalRepo: IArrivalRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: AddArrivalItemCommand): Promise<{ itemId: string }> {
    const arrival = await this.arrivalRepo.findById(command.arrivalId);
    if (!arrival) throw new NotFoundException('Arrival not found');
    const order = await this.orderRepo.findById(arrival.orderId);
    if (!order) throw new NotFoundException('Order not found');
    const orderItem = order.items.find(
      (i) => (typeof i.id === 'string' ? i.id : i.id.value) === command.orderItemId,
    );
    if (!orderItem) throw new NotFoundException('Order item not found');
    if (command.arrivedQuantity > orderItem.quantity) {
      throw new BadRequestException(
        'Cannot arrive more than ordered quantity',
      );
    }
    const item = ArrivalItemEntity.create({
      id: UniqueEntityId.create(generateUuid()),
      arrivalId: command.arrivalId,
      orderItemId: command.orderItemId,
      arrivedQuantity: command.arrivedQuantity,
      condition: command.condition ?? 'OK',
      notes: command.notes,
    });
    arrival.addItem(item);
    await this.arrivalRepo.save(arrival);
    return { itemId: item.id.value };
  }
}
