import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery) {
    const user = await this.userRepo.findById(query.id);
    if (!user) throw new NotFoundException(`User not found: ${query.id}`, 'USER_NOT_FOUND');
    return {
      id: user.id.value,
      email: user.email,
      fullName: user.fullName,
      merchantId: user.merchantId,
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
