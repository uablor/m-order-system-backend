import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { IPlatformRolePermissionRepository } from '../../../domain/repositories/platform-role-permission.repository';
import { PlatformRolePermissionOrmEntity } from '../entities/platform-role-permission.orm-entity';
import { PlatformRoleOrmEntity } from '../entities/platform-role.orm-entity';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';

@Injectable()
export class PlatformRolePermissionRepositoryImpl
  implements IPlatformRolePermissionRepository
{
  constructor(
    @InjectRepository(PlatformRolePermissionOrmEntity)
    private readonly linkRepo: Repository<PlatformRolePermissionOrmEntity>,
    @InjectRepository(PlatformRoleOrmEntity)
    private readonly roleRepo: Repository<PlatformRoleOrmEntity>,
    @InjectRepository(PermissionOrmEntity)
    private readonly permissionRepo: Repository<PermissionOrmEntity>,
  ) {}

  async getPermissionCodesByPlatformRoleName(roleName: string): Promise<string[]> {
    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) return [];

    const links = await this.linkRepo.find({
      where: { platform_role_id: role.id },
    });
    if (links.length === 0) return [];

    const permissionIds = links.map((l) => l.permission_id);
    const permissions = await this.permissionRepo.find({
      where: { id: In(permissionIds) },
      select: ['code'],
    });
    return permissions.map((p) => p.code);
  }

  async setPermissionsForPlatformRole(
    platformRoleDomainId: string,
    permissionDomainIds: string[],
  ): Promise<void> {
    const role = await this.roleRepo.findOne({
      where: { domain_id: platformRoleDomainId },
    });
    if (!role) return;

    await this.linkRepo.delete({ platform_role_id: role.id });

    if (permissionDomainIds.length === 0) return;

    const permissions = await this.permissionRepo.find({
      where: { domain_id: In(permissionDomainIds) },
      select: ['id'],
    });
    const toInsert = permissions.map((p) =>
      this.linkRepo.create({
        platform_role_id: role.id,
        permission_id: p.id,
      }),
    );
    await this.linkRepo.save(toInsert);
  }
}
