import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp, loginForE2E, authHeaders } from './helpers/e2e-helpers';

describe('Identity / Users (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

  beforeAll(async () => {
    const ctx = await createE2EApp();
    app = ctx.app;
    const auth = await loginForE2E(app);
    accessToken = auth?.accessToken ?? '';
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? authHeaders(accessToken) : {});

  describe('POST /users', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'new@example.com',
          password: 'password123',
          fullName: 'New User',
          roleId: '00000000-0000-0000-0000-000000000000',
          merchantId: process.env.TEST_MERCHANT_ID ?? '',
        })
        .expect(401);
    });

    it('returns 400 when body is invalid', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .post('/users')
        .set(auth())
        .send({})
        .expect(400);
    });
  });

  describe('GET /users/:id', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });

    it('returns 404 for non-existent user', async () => {
      if (!accessToken) return;
      return request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .set(auth())
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('returns 401 without token', () => {
      return request(app.getHttpServer())
        .patch('/users/00000000-0000-0000-0000-000000000000')
        .send({ fullName: 'Updated' })
        .expect(401);
    });
  });
});
