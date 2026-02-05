import type { MerchantPort } from '../../domain/services/merchant.port';

/**
 * Stub: always returns true. Replace with real implementation from merchant-management when available.
 */
export class MerchantPortStubAdapter implements MerchantPort {
  async isActive(_merchantId: string): Promise<boolean> {
    return true;
  }
}
