import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from './create-customer.command';
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from '../../domain/repositories/customer.repository';
import { CustomerAggregate } from '../../domain/aggregates/customer.aggregate';
import { UniqueEntityId } from '../../../../shared/domain/value-objects';
import { generateUuid } from '../../../../shared/utils';

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand, CustomerAggregate>
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<CustomerAggregate> {
    let token = command.token?.trim();
    if (!token) {
      let attempts = 0;
      const maxAttempts = 10;
      while (attempts < maxAttempts) {
        token = generateToken();
        const existing = await this.customerRepo.findByToken(token);
        if (!existing) break;
        attempts++;
      }
      if (!token) throw new Error('Could not generate unique customer token');
    } else {
      const existing = await this.customerRepo.findByToken(token);
      if (existing) throw new Error('Customer token must be unique');
    }

    const customer = CustomerAggregate.create({
      id: UniqueEntityId.create(generateUuid()),
      merchantId: command.merchantId,
      token,
      fullName: command.fullName.trim(),
      contactPhone: command.contactPhone,
      contactEmail: command.contactEmail,
    });
    return this.customerRepo.save(customer);
  }
}
