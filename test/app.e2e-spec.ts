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

describe('AppController (e2e)', () => {
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

  it('/ (GET) returns wrapped response with requestId', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data', 'Hello World!');
        expect(res.body).toHaveProperty('message', 'ok');
        expect(res.body).toHaveProperty('requestId');
        expect(res.headers['x-request-id']).toBeDefined();
      });
  });

  it('returns X-Request-Id header', () => {
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
