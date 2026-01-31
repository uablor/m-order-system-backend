import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createE2EApp } from './helpers/e2e-helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const ctx = await createE2EApp();
    app = ctx.app;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('returns 400 when body is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('returns 401 when credentials are invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrong',
          merchantId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(401);
    });

    it('returns 200 and tokens when credentials are valid', async () => {
      const email = process.env.TEST_USER_EMAIL;
      const password = process.env.TEST_USER_PASSWORD;
      const merchantId = process.env.TEST_MERCHANT_ID;
      if (!email || !password || !merchantId) {
        return;
      }
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password, merchantId })
        .expect(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('merchantId');
    });
  });

  describe('POST /auth/register', () => {
    it('returns 400 when body is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('returns 400 when body is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({})
        .expect(400);
    });

    it('returns 401 when refresh token is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });
});
