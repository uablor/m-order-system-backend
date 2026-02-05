import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IArrivalRepository,
  ArrivalRepositoryFindManyParams,
} from '../../../domain/repositories/arrival.repository';
import type { ArrivalAggregate } from '../../../domain/aggregates/arrival.aggregate';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
import { arrivalOrmToDomain, arrivalDomainToOrm } from '../mappers/arrival.mapper';
import { arrivalItemDomainToOrm } from '../mappers/arrival-item.mapper';

@Injectable()
export class ArrivalRepositoryImpl implements IArrivalRepository {
  constructor(
    @InjectRepository(ArrivalOrmEntity)
    private readonly arrivalRepo: Repository<ArrivalOrmEntity>,
    @InjectRepository(ArrivalItemOrmEntity)
    private readonly itemRepo: Repository<ArrivalItemOrmEntity>,
  ) {}

  async save(aggregate: ArrivalAggregate): Promise<ArrivalAggregate> {
    const arrivalId = aggregate.id.value;
    const ormArrival = this.arrivalRepo.create(
      arrivalDomainToOrm(aggregate) as Partial<ArrivalOrmEntity>,
    );
    ormArrival.arrival_id = arrivalId;
    await this.arrivalRepo.save(ormArrival);

    const existingIds = (
      await this.itemRepo.find({
        where: { arrival_id: arrivalId },
        select: ['arrival_item_id'],
      })
    ).map((r) => r.arrival_item_id);
    const currentIds = aggregate.items.map((i) =>
      typeof i.id === 'string' ? i.id : i.id.value,
    );
    for (const item of aggregate.items) {
      const itemId = typeof item.id === 'string' ? item.id : item.id.value;
      const ormItem = this.itemRepo.create(
        arrivalItemDomainToOrm(item, arrivalId) as Partial<ArrivalItemOrmEntity>,
      );
      ormItem.arrival_item_id = itemId;
      ormItem.arrival_id = arrivalId;
      await this.itemRepo.save(ormItem);
    }
    for (const id of existingIds) {
      if (!currentIds.includes(id)) await this.itemRepo.delete(id);
    }

    return this.findById(arrivalId) as Promise<ArrivalAggregate>;
  }

  async findById(id: string): Promise<ArrivalAggregate | null> {
    const orm = await this.arrivalRepo.findOne({
      where: { arrival_id: id },
      relations: ['items'],
    });
    return orm ? arrivalOrmToDomain(orm) : null;
  }

  async findMany(params: ArrivalRepositoryFindManyParams): Promise<{
    data: ArrivalAggregate[];
    total: number;
  }> {
    const qb = this.arrivalRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.items', 'items')
      .where('a.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.orderId) qb.andWhere('a.order_id = :orderId', { orderId: params.orderId });
    qb.orderBy('a.arrived_date', 'DESC').addOrderBy('a.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(arrivalOrmToDomain), total };
  }
}
