import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IPermissionRepository } from '../../../domain/repositories/permission.repository';
import type { PermissionAggregate } from '../../../domain/aggregates/permission.aggregate';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { permissionOrmToDomain } from '../mappers/permission.mapper';

@Injectable()
export class PermissionRepositoryImpl implements IPermissionRepository {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly repo: Repository<PermissionOrmEntity>,
  ) {}

  async findById(id: string): Promise<PermissionAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? permissionOrmToDomain(orm) : null;
  }

  async findByCode(code: string): Promise<PermissionAggregate | null> {
    const orm = await this.repo.findOne({ where: { code } });
    return orm ? permissionOrmToDomain(orm) : null;
  }

  async findMany(): Promise<PermissionAggregate[]> {
    const list = await this.repo.find({ order: { code: 'ASC' } });
    return list.map(permissionOrmToDomain);
  }
}
