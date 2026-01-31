import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp, loginForE2E, authHeaders, cleanTables } from './helpers/e2e-helpers';

describe('Payment (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let merchantId: string;

  beforeAll(async () => {
    const ctx = await createE2EApp();
    app = ctx.app;
    const auth = await loginForE2E(app);
    accessToken = auth?.accessToken ?? '';
    merchantId = auth?.merchantId ?? process.env.TEST_MERCHANT_ID ?? '';
  }, 30000);

  beforeEach(async () => {
    await cleanTables(app, ['payments']);
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? authHeaders(accessToken) : {});

  describe('POST /payments', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/payments')
        .send({
          orderId: '00000000-0000-0000-0000-000000000000',
          merchantId,
          customerId: '00000000-0000-0000-0000-000000000000',
          paymentAmount: 1000,
          paymentDate: new Date().toISOString().slice(0, 10),
          paymentMethod: 'BANK',
        })
        .expect(401);
    });

    it('returns 400 when body is invalid', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .post('/payments')
        .set(auth())
        .send({})
        .expect(400);
    });
  });

  describe('GET /payments/by-order/:orderId', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/payments/by-order/00000000-0000-0000-0000-000000000000')
        .query({ merchantId })
        .expect(401);
    });

    it('returns 200 with token (empty or list)', async () => {
      if (!accessToken) return;
      const res = await request(app.getHttpServer())
        .get('/payments/by-order/00000000-0000-0000-0000-000000000000')
        .set(auth())
        .query({ merchantId });
      expect([200]).toContain(res.status);
      const data = res.body?.data ?? res.body;
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /payments/:id/verify', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/payments/00000000-0000-0000-0000-000000000000/verify')
        .query({ merchantId })
        .send({ verifiedBy: '00000000-0000-0000-0000-000000000001' })
        .expect(401);
    });
  });

  describe('POST /payments/:id/reject', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/payments/00000000-0000-0000-0000-000000000000/reject')
        .query({ merchantId })
        .send({ rejectedBy: '00000000-0000-0000-0000-000000000001', rejectReason: 'Test' })
        .expect(401);
    });
  });
});
