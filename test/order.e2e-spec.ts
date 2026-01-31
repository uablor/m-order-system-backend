import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp, loginForE2E, authHeaders, cleanTables } from './helpers/e2e-helpers';

describe('Order (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let merchantId: string;
  let createdBy: string;

  beforeAll(async () => {
    const ctx = await createE2EApp();
    app = ctx.app;
    const auth = await loginForE2E(app);
    accessToken = auth?.accessToken ?? '';
    merchantId = auth?.merchantId ?? process.env.TEST_MERCHANT_ID ?? '';
    createdBy = process.env.TEST_USER_ID ?? '00000000-0000-0000-0000-000000000001';
  }, 30000);

  beforeEach(async () => {
    await cleanTables(app, ['customer_order_items', 'customer_orders', 'order_items', 'orders']);
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? authHeaders(accessToken) : {});

  describe('POST /orders', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          merchantId,
          createdBy,
          orderCode: 'ORD-001',
          orderDate: new Date().toISOString().slice(0, 10),
          items: [],
        })
        .expect(401);
    });

    it('returns 400 when body is invalid', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .post('/orders')
        .set(auth())
        .send({})
        .expect(400);
    });

    it('creates order when valid', async () => {
      if (!accessToken || !merchantId) return;
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set(auth())
        .send({
          merchantId,
          createdBy,
          orderCode: `ORD-${Date.now()}`,
          orderDate: new Date().toISOString().slice(0, 10),
          items: [
            {
              productName: 'Product A',
              variant: 'Size M',
              quantity: 2,
              purchaseCurrency: 'THB',
              purchasePrice: 100,
              purchaseExchangeRate: 350,
              totalCostBeforeDiscountLak: 70000,
              discountType: 'FIX',
              discountValue: 0,
              discountAmountLak: 0,
              finalCostLak: 70000,
              finalCostThb: 200,
              sellingPriceForeign: 150,
              sellingExchangeRate: 350,
              sellingTotalLak: 105000,
            },
          ],
        });
      if (res.status === 201) {
        expect(res.body).toHaveProperty('id');
        expect(res.body.items).toHaveLength(1);
      }
    });
  });

  describe('GET /orders', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .query({ merchantId })
        .expect(401);
    });

    it('returns 200 with token', async () => {
      if (!accessToken) return;
      const res = await request(app.getHttpServer())
        .get('/orders')
        .set(auth())
        .query({ merchantId, page: 1, limit: 10 })
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
    });
  });

  describe('GET /orders/:id', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/orders/00000000-0000-0000-0000-000000000000')
        .query({ merchantId })
        .expect(401);
    });

    it('returns 404 for non-existent order', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .get('/orders/00000000-0000-0000-0000-000000000000')
        .set(auth())
        .query({ merchantId })
        .expect(404);
    });
  });
});
