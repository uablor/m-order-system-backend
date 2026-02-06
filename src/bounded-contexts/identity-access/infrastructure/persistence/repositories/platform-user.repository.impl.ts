import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IPlatformUserRepository,
  PlatformUserRepositoryFindManyParams,
} from '../../../domain/repositories/platform-user.repository';
import type { PlatformUserAggregate } from '../../../domain/aggregates/platform-user.aggregate';
import { PlatformUserOrmEntity } from '../entities/platform-user.orm-entity';
import {
  platformUserDomainToOrm,
  platformUserOrmToDomain,
} from '../mappers/platform-user.mapper';

@Injectable()
export class PlatformUserRepositoryImpl implements IPlatformUserRepository {
  constructor(
    @InjectRepository(PlatformUserOrmEntity)
    private readonly repo: Repository<PlatformUserOrmEntity>,
  ) {}

  async save(user: PlatformUserAggregate): Promise<PlatformUserAggregate> {
    const orm = this.repo.create(platformUserDomainToOrm(user));
    await this.repo.save(orm);
    return user;
  }

  async findById(id: string): Promise<PlatformUserAggregate | null> {
    const orm = await this.repo.findOne({ where: { domain_id: id } });
    return orm ? platformUserOrmToDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<PlatformUserAggregate | null> {
    const orm = await this.repo.findOne({ where: { email } });
    return orm ? platformUserOrmToDomain(orm) : null;
  }

  async findMany(
    params: PlatformUserRepositoryFindManyParams,
  ): Promise<{ data: PlatformUserAggregate[]; total: number }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: items.map(platformUserOrmToDomain),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ domain_id: id });
  }
}
