/**
 * Port for checking merchant status (e.g. active). Implemented by merchant-management context.
 */
export const MERCHANT_PORT = Symbol('MERCHANT_PORT');

export interface MerchantPort {
  isActive(merchantId: string): Promise<boolean>;
}
