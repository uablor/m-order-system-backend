import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../../domain/repositories/user.repository';
import type { UserEntity } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { userOrmToDomain, userDomainToOrm } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const orm = this.userRepo.create(userDomainToOrm(user) as Partial<UserOrmEntity>);
    orm.technical_id = user.id;
    const saved = await this.userRepo.save(orm);
    return userOrmToDomain(saved);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const orm = await this.userRepo.findOne({
      where: { domain_id: id },
      relations: ['role'],
    });
    if (!orm) return null;
    return userOrmToDomain(orm);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const orm = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
    if (!orm) return null;
    return userOrmToDomain(orm);
  }

  async findByEmailAndMerchant(
    email: string,
    merchantId: string,
  ): Promise<UserEntity | null> {
    const orm = await this.userRepo.findOne({
      where: { email, technical_merchant_id: merchantId },
      relations: ['role'],
    });
    if (!orm) return null;
    return userOrmToDomain(orm);
  }
}
