import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IPaymentRepository } from '../../../domain/repositories/payment.repository';
import type { PaymentAggregate } from '../../../domain/aggregates/payment.aggregate';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { paymentOrmToDomain, paymentDomainToOrm } from '../mappers/payment.mapper';
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class PaymentRepositoryImpl implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly repo: Repository<PaymentOrmEntity>,
  ) {}

  private getRepo(): Repository<PaymentOrmEntity> {
    const em = getTransactionManager();
    return em ? em.getRepository(PaymentOrmEntity) : this.repo;
  }

  async save(aggregate: PaymentAggregate): Promise<PaymentAggregate> {
    const repo = this.getRepo();
    const orm = repo.create(paymentDomainToOrm(aggregate) as Partial<PaymentOrmEntity>);
    const saved = await repo.save(orm);
    return paymentOrmToDomain(saved);
  }

  async findById(id: string): Promise<PaymentAggregate | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({ where: { domain_id: id } });
    if (!orm) return null;
    return paymentOrmToDomain(orm);
  }

  async findByOrderId(orderId: string): Promise<PaymentAggregate[]> {
    const repo = this.getRepo();
    const rows = await repo.find({ where: { order_id: orderId } });
    return rows.map(paymentOrmToDomain);
  }
}
