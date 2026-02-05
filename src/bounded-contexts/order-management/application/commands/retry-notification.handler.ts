import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RetryNotificationCommand } from './retry-notification.command';
import {
  NOTIFICATION_REPOSITORY,
  type INotificationRepository,
} from '../../domain/repositories/notification.repository';

@CommandHandler(RetryNotificationCommand)
export class RetryNotificationHandler implements ICommandHandler<RetryNotificationCommand> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repo: INotificationRepository,
  ) {}

  async execute(command: RetryNotificationCommand): Promise<void> {
    const aggregate = await this.repo.findById(command.id);
    if (!aggregate) throw new NotFoundException('Notification not found');
    try {
      aggregate.retry();
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
    await this.repo.save(aggregate);
  }
}
