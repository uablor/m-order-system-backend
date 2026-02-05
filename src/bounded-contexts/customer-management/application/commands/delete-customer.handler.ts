import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customerRepo.findById(command.id);
    if (!customer)
      throw new NotFoundException(`Customer not found: ${command.id}`, 'CUSTOMER_NOT_FOUND');
    await this.customerRepo.delete(command.id);
  }
}
