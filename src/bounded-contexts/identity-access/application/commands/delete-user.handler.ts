import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { USER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const user = await this.userRepo.findById(command.id);
    if (!user) throw new NotFoundException(`User not found: ${command.id}`, 'USER_NOT_FOUND');
    await this.userRepo.delete(command.id);
  }
}
