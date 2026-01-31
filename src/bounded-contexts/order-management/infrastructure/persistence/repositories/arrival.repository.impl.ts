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
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class ArrivalRepositoryImpl implements IArrivalRepository {
  constructor(
    @InjectRepository(ArrivalOrmEntity)
    private readonly arrivalRepo: Repository<ArrivalOrmEntity>,
    @InjectRepository(ArrivalItemOrmEntity)
    private readonly itemRepo: Repository<ArrivalItemOrmEntity>,
  ) {}

  private getRepos(): {
    arrivalRepo: Repository<ArrivalOrmEntity>;
    itemRepo: Repository<ArrivalItemOrmEntity>;
  } {
    const em = getTransactionManager();
    if (em) {
      return {
        arrivalRepo: em.getRepository(ArrivalOrmEntity),
        itemRepo: em.getRepository(ArrivalItemOrmEntity),
      };
    }
    return { arrivalRepo: this.arrivalRepo, itemRepo: this.itemRepo };
  }

  async save(aggregate: ArrivalAggregate): Promise<ArrivalAggregate> {
    const { arrivalRepo, itemRepo } = this.getRepos();
    const orm = arrivalRepo.create(
      arrivalDomainToOrm(aggregate) as Partial<ArrivalOrmEntity>,
    );
    const saved = await arrivalRepo.save(orm);

    if (aggregate.items.length > 0) {
      const itemOrms = aggregate.items.map((item) =>
        itemRepo.create(
          arrivalItemDomainToOrm(item) as Partial<ArrivalItemOrmEntity> & {
            arrival_id: string;
          },
        ),
      );
      for (const item of itemOrms) {
        (item as { arrival_id: string }).arrival_id = saved.domain_id;
      }
      await itemRepo.save(itemOrms);
    }

    const items = await itemRepo.find({
      where: { arrival_id: saved.domain_id },
    });
    return arrivalOrmToDomain(saved, items);
  }

  async findById(id: string): Promise<ArrivalAggregate | null> {
    const { arrivalRepo, itemRepo } = this.getRepos();
    const orm = await arrivalRepo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    const items = await itemRepo.find({ where: { arrival_id: id } });
    return arrivalOrmToDomain(orm, items);
  }

  async findMany(
    params: ArrivalRepositoryFindManyParams,
  ): Promise<{ data: ArrivalAggregate[]; total: number }> {
    const { arrivalRepo, itemRepo } = this.getRepos();
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const qb = arrivalRepo.createQueryBuilder('a');
    if (params.orderId) {
      qb.andWhere('a.order_id = :orderId', { orderId: params.orderId });
    }
    qb.orderBy('a.arrival_date', 'DESC');
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();

    const data: ArrivalAggregate[] = [];
    for (const row of rows) {
      const items = await itemRepo.find({ where: { arrival_id: row.domain_id } });
      data.push(arrivalOrmToDomain(row, items));
    }
    return { data, total };
  }
}
