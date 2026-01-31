import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordArrivalCommand } from './record-arrival.command';
import {
  ARRIVAL_REPOSITORY,
  type IArrivalRepository,
} from '../../domain/repositories/arrival.repository';
import { ArrivalAggregate } from '../../domain/aggregates/arrival.aggregate';
import { ArrivalItemEntity } from '../../domain/entities/arrival-item.entity';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(RecordArrivalCommand)
export class RecordArrivalHandler
  implements ICommandHandler<RecordArrivalCommand, ArrivalAggregate>
{
  constructor(
    @Inject(ARRIVAL_REPOSITORY)
    private readonly repo: IArrivalRepository,
  ) {}

  async execute(command: RecordArrivalCommand): Promise<ArrivalAggregate> {
    const arrivalId = generateUuid();
    const items = command.items.map((i) =>
      ArrivalItemEntity.create({
        id: generateUuid(),
        arrivalId,
        orderItemId: i.orderItemId,
        quantityReceived: i.quantityReceived,
        condition: i.condition,
      }),
    );
    const aggregate = ArrivalAggregate.create({
      id: arrivalId,
      orderId: command.orderId,
      arrivalDate: command.arrivalDate,
      status: 'RECEIVED',
      notes: command.notes,
      items,
    });
    return this.repo.save(aggregate);
  }
}
