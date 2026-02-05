import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  INotificationRepository,
  NotificationRepositoryFindManyParams,
} from '../../../domain/repositories/notification.repository';
import type { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import {
  notificationOrmToDomain,
  notificationDomainToOrm,
} from '../mappers/notification.mapper';

@Injectable()
export class NotificationRepositoryImpl implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repo: Repository<NotificationOrmEntity>,
  ) {}

  async save(aggregate: NotificationAggregate): Promise<NotificationAggregate> {
    const orm = this.repo.create(
      notificationDomainToOrm(aggregate) as Partial<NotificationOrmEntity>,
    );
    const domainId = aggregate.id.value;
    orm.notification_id = domainId;
    orm.domain_id = domainId;
    const saved = await this.repo.save(orm);
    return notificationOrmToDomain(saved);
  }

  async findById(domainId: string): Promise<NotificationAggregate | null> {
    const orm = await this.repo.findOne({ where: { domain_id: domainId } });
    return orm ? notificationOrmToDomain(orm) : null;
  }

  async findMany(params: NotificationRepositoryFindManyParams): Promise<{
    data: NotificationAggregate[];
    total: number;
  }> {
    const qb = this.repo
      .createQueryBuilder('n')
      .where('n.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.customerId) qb.andWhere('n.customer_id = :customerId', { customerId: params.customerId });
    if (params.notificationType) qb.andWhere('n.notification_type = :notificationType', { notificationType: params.notificationType });
    if (params.status) qb.andWhere('n.status = :status', { status: params.status });
    qb.orderBy('n.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(notificationOrmToDomain), total };
  }
}
