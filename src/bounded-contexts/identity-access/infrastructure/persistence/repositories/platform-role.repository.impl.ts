import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IPlatformRoleRepository,
  PlatformRoleRepositoryFindManyParams,
} from '../../../domain/repositories/platform-role.repository';
import type { PlatformRoleAggregate } from '../../../domain/aggregates/platform-role.aggregate';
import { PlatformRoleOrmEntity } from '../entities/platform-role.orm-entity';
import {
  platformRoleOrmToDomain,
  platformRoleDomainToOrm,
} from '../mappers/platform-role.mapper';

@Injectable()
export class PlatformRoleRepositoryImpl implements IPlatformRoleRepository {
  constructor(
    @InjectRepository(PlatformRoleOrmEntity)
    private readonly repo: Repository<PlatformRoleOrmEntity>,
  ) {}

  async save(role: PlatformRoleAggregate): Promise<PlatformRoleAggregate> {
    const domainId = typeof role.id === 'string' ? role.id : role.id.value;
    const orm = this.repo.create(platformRoleDomainToOrm(role) as Partial<PlatformRoleOrmEntity>);
  
    orm.domain_id = domainId;
    await this.repo.save(orm);
    return role;
  }

  async findById(id: string): Promise<PlatformRoleAggregate | null> {
    const orm = await this.repo.findOne({ where: { domain_id: id } });
    return orm ? platformRoleOrmToDomain(orm) : null;
  }

  async findByName(name: string): Promise<PlatformRoleAggregate | null> {
    const orm = await this.repo.findOne({ where: { name } });
    return orm ? platformRoleOrmToDomain(orm) : null;
  }

  async findMany(
    params?: PlatformRoleRepositoryFindManyParams,
  ): Promise<{ data: PlatformRoleAggregate[]; total: number }> {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 20));
    const skip = (page - 1) * limit;

    const [list, total] = await this.repo.findAndCount({
      skip,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: list.map(platformRoleOrmToDomain),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ domain_id: id });
  }
}
