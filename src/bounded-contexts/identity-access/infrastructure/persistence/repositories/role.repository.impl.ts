import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IRoleRepository } from '../../../domain/repositories/role.repository';
import type { RoleAggregate } from '../../../domain/aggregates/role.aggregate';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { RolePermissionOrmEntity } from '../entities/role-permission.orm-entity';
import { roleOrmToDomain, roleDomainToOrm } from '../mappers/role.mapper';

@Injectable()
export class RoleRepositoryImpl implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>,
    @InjectRepository(RolePermissionOrmEntity)
    private readonly rpRepo: Repository<RolePermissionOrmEntity>,
  ) {}

  async save(role: RoleAggregate): Promise<RoleAggregate> {
    const orm = this.roleRepo.create(roleDomainToOrm(role) as Partial<RoleOrmEntity>);

    const saved = await this.roleRepo.save(orm);
    await this.rpRepo.delete({ role_id: role.id.value });
    for (const pid of role.permissionIds) {
      await this.rpRepo.save(
        this.rpRepo.create({ role_id: role.id.value, permission_id: pid }),
      );
    }
    const permissionIds = role.permissionIds;
    return roleOrmToDomain(saved, permissionIds);
  }

  async findById(id: string): Promise<RoleAggregate | null> {
    const orm = await this.roleRepo.findOne({ where: { id } });
    if (!orm) return null;
    const rows = await this.rpRepo.find({ where: { role_id: id } });
    const permissionIds = rows.map((r) => r.permission_id);
    return roleOrmToDomain(orm, permissionIds);
  }

  async findByName(name: string, merchantId?: string): Promise<RoleAggregate | null> {
    const qb = this.roleRepo
      .createQueryBuilder('r')
      .where('r.name = :name', { name });
    if (merchantId != null) {
      qb.andWhere('(r.merchant_id = :merchantId OR r.merchant_id IS NULL)', {
        merchantId,
      });
    }
    const orm = await qb.getOne();
    if (!orm) return null;
    const rows = await this.rpRepo.find({ where: { role_id: orm.id } });
    const permissionIds = rows.map((r) => r.permission_id);
    return roleOrmToDomain(orm, permissionIds);
  }

  async findMany(merchantId?: string): Promise<RoleAggregate[]> {
    const qb = this.roleRepo.createQueryBuilder('r').orderBy('r.name', 'ASC');
    if (merchantId != null) {
      qb.where('r.merchant_id = :merchantId OR r.merchant_id IS NULL', {
        merchantId,
      });
    }
    const list = await qb.getMany();
    const result: RoleAggregate[] = [];
    for (const orm of list) {
      const rows = await this.rpRepo.find({ where: { role_id: orm.id } });
      result.push(roleOrmToDomain(orm, rows.map((r) => r.permission_id)));
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.rpRepo.delete({ role_id: id });
    await this.roleRepo.delete(id);
  }
}
