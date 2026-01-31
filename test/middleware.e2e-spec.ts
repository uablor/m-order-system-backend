import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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

describe('Middleware (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
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
  });

  afterEach(async () => {
    await app.close();
  });

  describe('RequestIdMiddleware', () => {
    it('attaches X-Request-Id to response', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-request-id']).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
          );
        });
    });
  });

  describe('RateLimitMiddleware', () => {
    it('sets X-RateLimit-* headers on response', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-ratelimit-limit']).toBeDefined();
          expect(res.headers['x-ratelimit-remaining']).toBeDefined();
          expect(res.headers['x-ratelimit-reset']).toBeDefined();
        });
    });
  });

  describe('Auth (JwtAuthGuard)', () => {
    it('returns 401 for protected route without token', () => {
      return request(app.getHttpServer()).get('/orders').expect(401);
    });
  });
});
