import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import {
  requestIdMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
} from '../../src/shared/middleware';
import { LoggingInterceptor, TransformResponseInterceptor } from '../../src/shared/interceptors';
import { GlobalExceptionFilter } from '../../src/shared/filters';
import { LoggerService } from '../../src/shared/logger';

export interface E2EAppContext {
  app: INestApplication<App>;
  module: TestingModule;
}

export async function createE2EApp(): Promise<E2EAppContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

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
  return { app, module: moduleFixture };
}

export interface LoginCredentials {
  email: string;
  password: string;
  merchantId: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  merchantId: string;
}

/**
 * Login via POST /auth/login. Returns token and merchantId for protected APIs.
 * Use TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_MERCHANT_ID from env.
 */
export async function loginForE2E(
  app: INestApplication<App>,
  credentials?: Partial<LoginCredentials>,
): Promise<AuthResult | null> {
  const email = credentials?.email ?? process.env.TEST_USER_EMAIL ?? '';
  const password = credentials?.password ?? process.env.TEST_USER_PASSWORD ?? '';
  const merchantId = credentials?.merchantId ?? process.env.TEST_MERCHANT_ID ?? '';

  if (!email || !password || !merchantId) {
    return null;
  }

  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password, merchantId });

  if (res.status !== 200 || !res.body?.accessToken) {
    return null;
  }

  return {
    accessToken: res.body.accessToken,
    refreshToken: res.body.refreshToken ?? '',
    merchantId: res.body.user?.merchantId ?? merchantId,
  };
}

export function authHeaders(accessToken: string): { Authorization: string } {
  return { Authorization: `Bearer ${accessToken}` };
}

/**
 * Clean tables before E2E tests. Pass table names (snake_case as in DB).
 * Use with care; only in beforeEach when test DB is dedicated.
 */
export async function cleanTables(app: INestApplication<App>, tables: string[]): Promise<void> {
  try {
    const ds = app.get(DataSource);
    for (const table of tables) {
      await ds.query(`DELETE FROM ${table}`);
    }
  } catch {
    // ignore if table does not exist
  }
}
