import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { INotificationRepository } from '../../../domain/repositories/notification.repository';
import type { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import {
  notificationOrmToDomain,
  notificationDomainToOrm,
} from '../mappers/notification.mapper';
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class NotificationRepositoryImpl implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repo: Repository<NotificationOrmEntity>,
  ) {}

  private getRepo(): Repository<NotificationOrmEntity> {
    const em = getTransactionManager();
    return em ? em.getRepository(NotificationOrmEntity) : this.repo;
  }

  async save(aggregate: NotificationAggregate): Promise<NotificationAggregate> {
    const repo = this.getRepo();
    const orm = repo.create(
      notificationDomainToOrm(aggregate) as Partial<NotificationOrmEntity>,
    );
    const saved = await repo.save(orm);
    return notificationOrmToDomain(saved);
  }

  async findById(id: string): Promise<NotificationAggregate | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return notificationOrmToDomain(orm);
  }
}
