/**
 * Domain: Payment aggregate invariants. No mocks.
 */
import { PaymentAggregate } from '../../../../src/bounded-contexts/order-management/domain/aggregates/payment.aggregate';
import { createPaymentAggregate, createPaymentId } from '../../../fixtures/domain/payment.fixture';

describe('PaymentAggregate', () => {
  describe('create', () => {
    it('throws when orderId is empty', () => {
      expect(() =>
        PaymentAggregate.create({
          id: createPaymentId(),
          orderId: '',
          merchantId: 'm1',
          customerId: 'c1',
          paymentAmount: 100,
          paymentDate: new Date(),
          paymentMethod: 'BANK',
          status: 'PENDING',
        }),
      ).toThrow('Order is required');
    });

    it('throws when paymentAmount is not positive', () => {
      expect(() =>
        PaymentAggregate.create({
          id: createPaymentId(),
          orderId: 'o1',
          merchantId: 'm1',
          customerId: 'c1',
          paymentAmount: 0,
          paymentDate: new Date(),
          paymentMethod: 'BANK',
          status: 'PENDING',
        }),
      ).toThrow('Payment amount must be a positive number');
    });

    it('creates with PENDING status', () => {
      const payment = createPaymentAggregate();
      expect(payment.status).toBe('PENDING');
      expect(payment.paymentAmount).toBeGreaterThan(0);
    });
  });

  describe('verify', () => {
    it('sets status to VERIFIED and sets verifiedBy/verifiedAt', () => {
      const payment = createPaymentAggregate();
      payment.verify('admin-id');
      expect(payment.status).toBe('VERIFIED');
      expect(payment.verifiedBy).toBe('admin-id');
      expect(payment.verifiedAt).toBeDefined();
    });

    it('throws when status is not PENDING', () => {
      const payment = createPaymentAggregate();
      payment.verify('admin');
      expect(() => payment.verify('other')).toThrow('Only PENDING payment can be verified');
    });
  });

  describe('reject', () => {
    it('sets status to REJECTED and sets rejectedBy/rejectedAt/rejectReason', () => {
      const payment = createPaymentAggregate();
      payment.reject('admin-id', 'Invalid proof');
      expect(payment.status).toBe('REJECTED');
      expect(payment.rejectedBy).toBe('admin-id');
      expect(payment.rejectedAt).toBeDefined();
      expect(payment.rejectReason).toBe('Invalid proof');
    });

    it('throws when already VERIFIED', () => {
      const payment = createPaymentAggregate();
      payment.verify('admin');
      expect(() => payment.reject('admin', 'reason')).toThrow(
        'Cannot reject already verified payment',
      );
    });
  });
});
