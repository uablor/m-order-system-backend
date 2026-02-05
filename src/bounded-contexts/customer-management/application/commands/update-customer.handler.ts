import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from './update-customer.command';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { NotFoundException } from '../../../../shared/domain/exceptions';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const customer = await this.customerRepo.findById(command.id);
    if (!customer)
      throw new NotFoundException(`Customer not found: ${command.id}`, 'CUSTOMER_NOT_FOUND');
    customer.updateContact(
      command.payload.fullName ?? customer.fullName,
      command.payload.contactPhone,
      command.payload.contactEmail,
    );
    await this.customerRepo.save(customer);
  }
}
