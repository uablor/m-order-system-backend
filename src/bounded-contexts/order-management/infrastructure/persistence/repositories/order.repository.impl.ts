import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IOrderRepository,
  OrderRepositoryFindManyParams,
} from '../../../domain/repositories/order.repository';
import type { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { orderOrmToDomain, orderDomainToOrm } from '../mappers/order.mapper';
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderRepo: Repository<OrderOrmEntity>,
  ) {}

  private getRepo(): Repository<OrderOrmEntity> {
    const em = getTransactionManager();
    if (em) {
      return em.getRepository(OrderOrmEntity);
    }
    return this.orderRepo;
  }

  async save(order: OrderEntity): Promise<OrderEntity> {
    const repo = this.getRepo();
    const orm = repo.create(orderDomainToOrm(order) as Partial<OrderOrmEntity>);
    orm.technical_id = order.id;
    const saved = await repo.save(orm);
    return orderOrmToDomain(saved);
  }

  async findById(id: string, merchantId: string): Promise<OrderEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({
      where: { domain_id: id, technical_merchant_id: merchantId },
    });
    if (!orm) return null;
    return orderOrmToDomain(orm);
  }

  async findByOrderCode(orderCode: string, merchantId: string): Promise<OrderEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({
      where: { order_code: orderCode, technical_merchant_id: merchantId },
    });
    if (!orm) return null;
    return orderOrmToDomain(orm);
  }

  async findMany(
    params: OrderRepositoryFindManyParams,
  ): Promise<{ data: OrderEntity[]; total: number }> {
    const repo = this.getRepo();
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const qb = repo
      .createQueryBuilder('o')
      .where('o.technical_merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.fromDate) {
      qb.andWhere('o.order_date >= :fromDate', { fromDate: params.fromDate });
    }
    if (params.toDate) {
      qb.andWhere('o.order_date <= :toDate', { toDate: params.toDate });
    }
    qb.orderBy('o.order_date', 'DESC');
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data: rows.map((r) => orderOrmToDomain(r)), total };
  }
}
