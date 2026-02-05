export type DiscountType = 'PERCENT' | 'FIX';

export const DISCOUNT_TYPES: DiscountType[] = ['PERCENT', 'FIX'];

export function isDiscountType(value: string): value is DiscountType {
  return DISCOUNT_TYPES.includes(value as DiscountType);
}
