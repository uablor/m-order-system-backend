import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  requestIdMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
} from './shared/middleware';
import { LoggingInterceptor, TransformResponseInterceptor } from './shared/interceptors';
import { GlobalExceptionFilter } from './shared/filters';
import { LoggerService } from './shared/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Middleware (order matters: requestId first so it's available everywhere)
  app.use(requestIdMiddleware);
  app.use(loggingMiddleware);
  app.use(rateLimitMiddleware);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(app.get(LoggerService)),
    new TransformResponseInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Merchant Order Management System API')
    .setDescription('API for merchant order management')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'BearerAuth',
    )
    .addApiKey(
      { type: 'apiKey', name: 'x-request-id', in: 'header', description: 'Request ID (UUID)' },
      'X-Request-Id',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);
}

bootstrap();
