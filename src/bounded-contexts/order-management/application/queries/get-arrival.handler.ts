import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArrivalQuery } from './get-arrival.query';
import { ARRIVAL_REPOSITORY, type IArrivalRepository } from '../../domain/repositories/arrival.repository';

@QueryHandler(GetArrivalQuery)
export class GetArrivalHandler implements IQueryHandler<GetArrivalQuery> {
  constructor(
    @Inject(ARRIVAL_REPOSITORY)
    private readonly repo: IArrivalRepository,
  ) {}

  async execute(query: GetArrivalQuery) {
    const aggregate = await this.repo.findById(query.id);
    if (!aggregate) return null;
    return {
      id: aggregate.id.value,
      orderId: aggregate.orderId,
      merchantId: aggregate.merchantId,
      arrivedDate: aggregate.arrivedDate,
      arrivedTime: aggregate.arrivedTime,
      recordedBy: aggregate.recordedBy,
      notes: aggregate.notes,
      status: aggregate.status,
      items: aggregate.items.map((i) => ({
        id: typeof i.id === 'string' ? i.id : i.id.value,
        orderItemId: i.orderItemId,
        arrivedQuantity: i.arrivedQuantity,
        condition: i.condition,
        notes: i.notes,
      })),
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
