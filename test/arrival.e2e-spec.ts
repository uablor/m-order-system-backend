import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp, loginForE2E, authHeaders, cleanTables } from './helpers/e2e-helpers';

describe('Arrival (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let merchantId: string;
  let recordedBy: string;

  beforeAll(async () => {
    const ctx = await createE2EApp();
    app = ctx.app;
    const auth = await loginForE2E(app);
    accessToken = auth?.accessToken ?? '';
    merchantId = auth?.merchantId ?? process.env.TEST_MERCHANT_ID ?? '';
    recordedBy = process.env.TEST_USER_ID ?? '00000000-0000-0000-0000-000000000001';
  }, 30000);

  beforeEach(async () => {
    await cleanTables(app, ['arrival_items', 'arrivals']);
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? authHeaders(accessToken) : {});

  describe('POST /arrivals', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/arrivals')
        .send({
          orderId: '00000000-0000-0000-0000-000000000000',
          merchantId,
          arrivedDate: new Date().toISOString().slice(0, 10),
          arrivedTime: '10:00:00',
          recordedBy,
          items: [],
        })
        .expect(401);
    });

    it('returns 400 when body is invalid', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .post('/arrivals')
        .set(auth())
        .send({})
        .expect(400);
    });
  });

  describe('GET /arrivals/by-order/:orderId', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/arrivals/by-order/00000000-0000-0000-0000-000000000000')
        .query({ merchantId })
        .expect(401);
    });

    it('returns 200 with token (empty or list)', async () => {
      if (!accessToken) return;
      const res = await request(app.getHttpServer())
        .get('/arrivals/by-order/00000000-0000-0000-0000-000000000000')
        .set(auth())
        .query({ merchantId });
      expect([200]).toContain(res.status);
      const data = res.body?.data ?? res.body;
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
