import type { CustomerEntity } from '../entities/customer.entity';

export interface ICustomerRepository {
  save(customer: CustomerEntity): Promise<CustomerEntity>;
  findById(id: string): Promise<CustomerEntity | null>;
  findByMerchant(merchantId: string): Promise<CustomerEntity[]>;
  delete(id: string): Promise<void>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
