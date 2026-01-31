import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  requestIdMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
} from '../src/shared/middleware';
import { LoggingInterceptor, TransformResponseInterceptor } from '../src/shared/interceptors';
import { GlobalExceptionFilter } from '../src/shared/filters';
import { LoggerService } from '../src/shared/logger';

/**
 * E2E tests for Customer module.
 * Requires MySQL test database and a seeded user for login.
 * Set in .env.test or env: TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_MERCHANT_ID
 */
describe('Customer (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let merchantId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(requestIdMiddleware);
    app.use(loggingMiddleware);
    app.use(rateLimitMiddleware);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalInterceptors(
      new LoggingInterceptor(moduleFixture.get(LoggerService)),
      new TransformResponseInterceptor(),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();

    const email = process.env.TEST_USER_EMAIL ?? 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD ?? 'password123';
    merchantId = process.env.TEST_MERCHANT_ID ?? '';

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password, merchantId });

    if (loginRes.status === 200 && loginRes.body?.accessToken) {
      accessToken = loginRes.body.accessToken;
      if (!merchantId && loginRes.body?.user?.merchantId) {
        merchantId = loginRes.body.user.merchantId;
      }
    } else {
      accessToken = '';
    }
  }, 30000);

  beforeEach(async () => {
    try {
      const ds = app.get(DataSource);
      await ds.query('DELETE FROM customers');
    } catch {
      // ignore if table does not exist yet
    }
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {});

  it('unauthorized access returns 401', () => {
    return request(app.getHttpServer())
      .get('/customers')
      .expect(401);
  });

  it('create customer', async () => {
    if (!accessToken || !merchantId) {
      console.warn('Skipping: TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_MERCHANT_ID not set or login failed');
      return;
    }
    const res = await request(app.getHttpServer())
      .post('/customers')
      .set(auth())
      .send({
        customerName: 'E2E Customer',
        customerType: 'CUSTOMER',
        contactPhone: '+8562012345678',
        preferredContactMethod: 'PHONE',
      })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.customerName).toBe('E2E Customer');
    expect(res.body.customerType).toBe('CUSTOMER');
    expect(res.body.isActive).toBe(true);
    expect(res.body).not.toHaveProperty('uniqueToken');
  });

  it('get customer by id', async () => {
    if (!accessToken || !merchantId) return;
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .set(auth())
      .send({
        customerName: 'Get Test',
        customerType: 'CUSTOMER',
      })
      .expect(201);
    const id = createRes.body.id;
    const getRes = await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .set(auth())
      .expect(200);
    expect(getRes.body.id).toBe(id);
    expect(getRes.body.customerName).toBe('Get Test');
    expect(getRes.body).not.toHaveProperty('uniqueToken');
  });

  it('update customer', async () => {
    if (!accessToken || !merchantId) return;
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .set(auth())
      .send({
        customerName: 'Update Before',
        customerType: 'CUSTOMER',
      })
      .expect(201);
    const id = createRes.body.id;
    const updateRes = await request(app.getHttpServer())
      .put(`/customers/${id}`)
      .set(auth())
      .send({ customerName: 'Update After', contactPhone: '+8562098765432' })
      .expect(200);
    expect(updateRes.body.customerName).toBe('Update After');
    expect(updateRes.body.contactPhone).toBe('+8562098765432');
  });

  it('deactivate customer', async () => {
    if (!accessToken || !merchantId) return;
    const createRes = await request(app.getHttpServer())
      .post('/customers')
      .set(auth())
      .send({
        customerName: 'Deactivate Test',
        customerType: 'CUSTOMER',
      })
      .expect(201);
    const id = createRes.body.id;
    const patchRes = await request(app.getHttpServer())
      .patch(`/customers/${id}/deactivate`)
      .set(auth())
      .expect(200);
    expect(patchRes.body.isActive).toBe(false);
  });

  it('list customers', async () => {
    if (!accessToken || !merchantId) return;
    const listRes = await request(app.getHttpServer())
      .get('/customers')
      .set(auth())
      .query({ page: 1, limit: 10 })
      .expect(200);
    expect(listRes.body).toHaveProperty('data');
    expect(listRes.body).toHaveProperty('meta');
    expect(Array.isArray(listRes.body.data)).toBe(true);
  });

  it('unique_token is unique and exposed only in token-link', async () => {
    if (!accessToken || !merchantId) return;
    const create1 = await request(app.getHttpServer())
      .post('/customers')
      .set(auth())
      .send({
        customerName: 'Token Customer 1',
        customerType: 'CUSTOMER',
      })
      .expect(201);
    const create2 = await request(app.getHttpServer())
      .post('/customers')
      .set(auth())
      .send({
        customerName: 'Token Customer 2',
        customerType: 'CUSTOMER',
      })
      .expect(201);
    expect(create1.body).not.toHaveProperty('uniqueToken');
    expect(create2.body).not.toHaveProperty('uniqueToken');

    const link1 = await request(app.getHttpServer())
      .get(`/customers/${create1.body.id}/token-link`)
      .set(auth())
      .expect(200);
    const link2 = await request(app.getHttpServer())
      .get(`/customers/${create2.body.id}/token-link`)
      .set(auth())
      .expect(200);

    expect(link1.body).toHaveProperty('uniqueToken');
    expect(link2.body).toHaveProperty('uniqueToken');
    expect(link1.body.uniqueToken).not.toBe(link2.body.uniqueToken);
    expect(link1.body).toHaveProperty('link');
  });
});
