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
import { paginateEntity } from '@shared/infrastructure/persistence/pagination';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: UserAggregate): Promise<UserAggregate> {
    const orm = this.repo.create(userDomainToOrm(user));
    
    const saved = await this.repo.save(orm);
    return userOrmToDomain(saved);
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const orm = await this.repo.findOne({ where: { domain_id: id } });
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
    const result = await paginateEntity(this.repo, { page: params.page, limit: params.limit }, {
      where: { merchant_id: params.merchantId ?? undefined } as object,
      order: { created_at: 'DESC' } as { created_at: 'DESC' },
    });
    return {
      data: result.data.map(userOrmToDomain),
      total: result.total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
