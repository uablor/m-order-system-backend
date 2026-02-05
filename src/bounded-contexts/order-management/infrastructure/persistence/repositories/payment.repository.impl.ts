import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IPaymentRepository,
  PaymentRepositoryFindManyParams,
} from '../../../domain/repositories/payment.repository';
import type { PaymentAggregate } from '../../../domain/aggregates/payment.aggregate';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { paymentOrmToDomain, paymentDomainToOrm } from '../mappers/payment.mapper';

@Injectable()
export class PaymentRepositoryImpl implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly repo: Repository<PaymentOrmEntity>,
  ) {}

  async save(aggregate: PaymentAggregate): Promise<PaymentAggregate> {
    const orm = this.repo.create(
      paymentDomainToOrm(aggregate) as Partial<PaymentOrmEntity>,
    );
    orm.payment_id = aggregate.id.value;
    const saved = await this.repo.save(orm);
    return paymentOrmToDomain(saved);
  }

  async findById(id: string): Promise<PaymentAggregate | null> {
    const orm = await this.repo.findOne({ where: { payment_id: id } });
    return orm ? paymentOrmToDomain(orm) : null;
  }

  async findMany(params: PaymentRepositoryFindManyParams): Promise<{
    data: PaymentAggregate[];
    total: number;
  }> {
    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.merchant_id = :merchantId', { merchantId: params.merchantId });
    if (params.orderId) qb.andWhere('p.order_id = :orderId', { orderId: params.orderId });
    if (params.customerId) qb.andWhere('p.customer_id = :customerId', { customerId: params.customerId });
    if (params.status) qb.andWhere('p.status = :status', { status: params.status });
    qb.orderBy('p.created_at', 'DESC');

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [list, total] = await qb.getManyAndCount();
    return { data: list.map(paymentOrmToDomain), total };
  }
}
