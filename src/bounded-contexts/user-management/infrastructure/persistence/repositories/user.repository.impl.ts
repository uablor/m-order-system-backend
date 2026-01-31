import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../../domain/repositories/user.repository';
import type { UserEntity } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { userOrmToDomainWithRole, userDomainToOrm } from '../mappers/user.mapper';
import { getTransactionManager } from '../../../../../shared/infrastructure/persistence';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  private getRepo(): Repository<UserOrmEntity> {
    const em = getTransactionManager();
    return em ? em.getRepository(UserOrmEntity) : this.repo;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const repo = this.getRepo();
    const orm = repo.create(userDomainToOrm(user) as object);
    const saved = await repo.save(orm);
    return userOrmToDomainWithRole(saved);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({
      where: { domain_id: id },
      relations: ['role'],
    });
    if (!orm) return null;
    return userOrmToDomainWithRole(orm);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({
      where: { email: email.trim().toLowerCase() },
      relations: ['role'],
    });
    if (!orm) return null;
    return userOrmToDomainWithRole(orm);
  }

  async findByEmailAndMerchant(email: string, merchantId: string): Promise<UserEntity | null> {
    const repo = this.getRepo();
    const orm = await repo.findOne({
      where: { email: email.trim().toLowerCase(), merchant_id: merchantId },
      relations: ['role'],
    });
    if (!orm) return null;
    return userOrmToDomainWithRole(orm);
  }
}
