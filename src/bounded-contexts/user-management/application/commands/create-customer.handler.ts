import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from './create-customer.command';
import { CUSTOMER_REPOSITORY, type ICustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { generateUuid } from '../../../../shared/utils';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand, CustomerEntity>
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<CustomerEntity> {
    const customer = CustomerEntity.create({
      id: generateUuid(),
      merchantId: command.merchantId,
      name: command.name.trim(),
      phone: command.phone?.trim(),
      email: command.email?.trim(),
      address: command.address?.trim(),
    });
    return this.customerRepository.save(customer);
  }
}
