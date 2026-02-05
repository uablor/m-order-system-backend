export type RateType = 'BUY' | 'SELL';

export const RATE_TYPES: RateType[] = ['BUY', 'SELL'];

export function isRateType(value: string): value is RateType {
  return RATE_TYPES.includes(value as RateType);
}
