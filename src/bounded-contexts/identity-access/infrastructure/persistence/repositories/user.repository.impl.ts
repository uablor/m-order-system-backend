import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IUserRepository,
  UserRepositoryFindManyParams,
} from '../../../domain/repositories/user.repository';
import type { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { userOrmToDomain, userDomainToOrm } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: UserAggregate): Promise<UserAggregate> {
    const orm = this.repo.create(userDomainToOrm(user) as Partial<UserOrmEntity>);
    orm.id = user.id.value;
    const saved = await this.repo.save(orm);
    return userOrmToDomain(saved);
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? userOrmToDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const orm = await this.repo.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    return orm ? userOrmToDomain(orm) : null;
  }

  async findMany(
    params: UserRepositoryFindManyParams,
  ): Promise<{ data: UserAggregate[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const [rows, total] = await this.repo.findAndCount({
      where: { merchant_id: params.merchantId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: rows.map(userOrmToDomain), total };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
