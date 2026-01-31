import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp, loginForE2E, authHeaders, cleanTables } from './helpers/e2e-helpers';

describe('Notification (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let merchantId: string;
  let customerId: string;

  beforeAll(async () => {
    const ctx = await createE2EApp();
    app = ctx.app;
    const auth = await loginForE2E(app);
    accessToken = auth?.accessToken ?? '';
    merchantId = auth?.merchantId ?? process.env.TEST_MERCHANT_ID ?? '';
    customerId = process.env.TEST_CUSTOMER_ID ?? '00000000-0000-0000-0000-000000000000';
  }, 30000);

  beforeEach(async () => {
    await cleanTables(app, ['notifications']);
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? authHeaders(accessToken) : {});

  describe('POST /notifications/send', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/notifications/send')
        .send({
          merchantId,
          customerId,
          notificationType: 'REMINDER',
          channel: 'LINE',
          recipientContact: '+8562012345678',
          messageContent: 'Test message',
        })
        .expect(401);
    });

    it('returns 400 when body is invalid', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .post('/notifications/send')
        .set(auth())
        .send({})
        .expect(400);
    });

    it('sends notification when valid', async () => {
      if (!accessToken || !merchantId) return;
      const res = await request(app.getHttpServer())
        .post('/notifications/send')
        .set(auth())
        .send({
          merchantId,
          customerId,
          notificationType: 'REMINDER',
          channel: 'LINE',
          recipientContact: '+8562012345678',
          messageContent: 'E2E test message',
        });
      expect([200, 201]).toContain(res.status);
      if (res.body?.id) {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('messageContent');
      }
    });
  });

  describe('GET /notifications/history', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/notifications/history')
        .query({ merchantId })
        .expect(401);
    });

    it('returns 200 with token', async () => {
      if (!accessToken) return;
      const res = await request(app.getHttpServer())
        .get('/notifications/history')
        .set(auth())
        .query({ merchantId, page: 1, limit: 10 })
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
    });
  });
});
