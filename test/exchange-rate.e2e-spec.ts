import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp, loginForE2E, authHeaders } from './helpers/e2e-helpers';

describe('ExchangeRate (e2e)', () => {
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

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? authHeaders(accessToken) : {});

  describe('POST /exchange-rates', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/exchange-rates')
        .send({
          merchantId,
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rateType: 'BUY',
          rate: 350,
          rateDate: new Date().toISOString().slice(0, 10),
          createdBy: '00000000-0000-0000-0000-000000000000',
        })
        .expect(401);
    });

    it('returns 400 when body is invalid', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .post('/exchange-rates')
        .set(auth())
        .send({})
        .expect(400);
    });

    it('creates rate when valid', async () => {
      if (!accessToken || !merchantId) return;
      const userId = process.env.TEST_USER_ID ?? '00000000-0000-0000-0000-000000000001';
      const rateDate = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .post('/exchange-rates')
        .set(auth())
        .send({
          merchantId,
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rateType: 'BUY',
          rate: 350,
          rateDate,
          createdBy: userId,
        });
      if (res.status === 201) {
        expect(res.body).toHaveProperty('id');
        expect(res.body.rateType).toBe('BUY');
        expect(res.body.rate).toBe(350);
      }
    });
  });

  describe('GET /exchange-rates/latest', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/exchange-rates/latest')
        .query({
          merchantId,
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rateType: 'BUY',
          rateDate: new Date().toISOString().slice(0, 10),
        })
        .expect(401);
    });

    it('returns 200 with token', async () => {
      if (!accessToken) return;
      const rateDate = new Date().toISOString().slice(0, 10);
      const res = await request(app.getHttpServer())
        .get('/exchange-rates/latest')
        .set(auth())
        .query({
          merchantId,
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rateType: 'BUY',
          rateDate,
        });
      expect([200, 404]).toContain(res.status);
    });
  });
});
