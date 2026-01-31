import type { ArrivalAggregate } from '../aggregates/arrival.aggregate';

export const ARRIVAL_REPOSITORY = Symbol('ARRIVAL_REPOSITORY');

export interface ArrivalRepositoryFindManyParams {
  orderId?: string;
  page?: number;
  limit?: number;
}

export interface IArrivalRepository {
  save(aggregate: ArrivalAggregate): Promise<ArrivalAggregate>;
  findById(id: string): Promise<ArrivalAggregate | null>;
  findMany(params: ArrivalRepositoryFindManyParams): Promise<{
    data: ArrivalAggregate[];
    total: number;
  }>;
}
