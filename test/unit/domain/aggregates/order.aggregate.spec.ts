/**
 * Domain: Order aggregate invariants and behavior. No mocks.
 */
import { OrderAggregate } from '../../../../src/bounded-contexts/order-management/domain/aggregates/order.aggregate';
import { UniqueEntityId } from '../../../../src/shared/domain/value-objects';
import { createOrderAggregate, createOrderItem } from '../../../fixtures/domain/order.fixture';

describe('OrderAggregate', () => {
  describe('create', () => {
    it('throws when merchantId is empty', () => {
      expect(() =>
        OrderAggregate.create({
          id: UniqueEntityId.create('id'),
          merchantId: '',
          createdBy: 'user',
          orderCode: 'ORD-1',
          orderDate: new Date(),
          arrivalStatus: 'NOT_ARRIVED',
          totalPurchaseCostLak: 0,
          totalShippingCostLak: 0,
          totalCostBeforeDiscountLak: 0,
          totalDiscountLak: 0,
          totalFinalCostLak: 0,
          totalFinalCostThb: 0,
          totalSellingAmountLak: 0,
          totalSellingAmountThb: 0,
          totalProfitLak: 0,
          totalProfitThb: 0,
          depositAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          paymentStatus: 'UNPAID',
          isClosed: false,
        }),
      ).toThrow('Merchant is required');
    });

    it('throws when orderCode is empty', () => {
      expect(() =>
        OrderAggregate.create({
          id: UniqueEntityId.create('id'),
          merchantId: 'm1',
          createdBy: 'user',
          orderCode: '  ',
          orderDate: new Date(),
          arrivalStatus: 'NOT_ARRIVED',
          totalPurchaseCostLak: 0,
          totalShippingCostLak: 0,
          totalCostBeforeDiscountLak: 0,
          totalDiscountLak: 0,
          totalFinalCostLak: 0,
          totalFinalCostThb: 0,
          totalSellingAmountLak: 0,
          totalSellingAmountThb: 0,
          totalProfitLak: 0,
          totalProfitThb: 0,
          depositAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          paymentStatus: 'UNPAID',
          isClosed: false,
        }),
      ).toThrow('Order code is required');
    });

    it('creates with defaults for optional fields', () => {
      const order = createOrderAggregate({ orderCode: 'ORD-1' });
      expect(order.orderCode).toBe('ORD-1');
      expect(order.arrivalStatus).toBe('NOT_ARRIVED');
      expect(order.paymentStatus).toBe('UNPAID');
      expect(order.paidAmount).toBe(0);
      expect(order.remainingAmount).toBe(0);
      expect(order.isClosed).toBe(false);
      expect(order.items).toEqual([]);
    });
  });

  describe('recordPayment', () => {
    it('updates paidAmount and remainingAmount', () => {
      const order = createOrderAggregate({
        totalSellingAmountLak: 100000,
        paidAmount: 0,
        remainingAmount: 100000,
      });
      order.recordPayment(30000);
      expect(order.paidAmount).toBe(30000);
      expect(order.remainingAmount).toBe(70000);
      expect(order.paymentStatus).toBe('PARTIAL');
    });

    it('sets status PAID when remaining is 0', () => {
      const order = createOrderAggregate({
        totalSellingAmountLak: 100000,
        paidAmount: 0,
        remainingAmount: 100000,
      });
      order.recordPayment(100000);
      expect(order.paymentStatus).toBe('PAID');
      expect(order.remainingAmount).toBe(0);
    });
  });

  describe('markArrived', () => {
    it('sets arrivalStatus to ARRIVED and arrivedAt', () => {
      const order = createOrderAggregate();
      const at = new Date();
      order.markArrived(at);
      expect(order.arrivalStatus).toBe('ARRIVED');
      expect(order.arrivedAt).toEqual(at);
    });
  });

  describe('close', () => {
    it('sets isClosed to true', () => {
      const order = createOrderAggregate();
      order.close();
      expect(order.isClosed).toBe(true);
    });
  });

  describe('addItem / recalculateFromItems', () => {
    it('adds item and recalculates totals', () => {
      const order = createOrderAggregate();
      const item = createOrderItem({
        orderId: order.id.value,
        purchaseTotalLak: 70000,
        finalCostLak: 70000,
        sellingTotalLak: 105000,
        profitLak: 35000,
        profitThb: 100,
      });
      order.addItem(item);
      expect(order.items).toHaveLength(1);
      expect(order.totalPurchaseCostLak).toBe(70000);
      expect(order.totalSellingAmountLak).toBe(105000);
    });
  });

  describe('domainEvents', () => {
    it('exposes domainEvents array', () => {
      const order = createOrderAggregate();
      expect(order.domainEvents).toEqual([]);
      order.clearEvents();
      expect(order.domainEvents).toEqual([]);
    });
  });
});
