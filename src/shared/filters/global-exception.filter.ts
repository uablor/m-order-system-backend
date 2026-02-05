import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException, NotFoundException } from '../domain/exceptions';
import { ResponseBuilder } from '../application/response/ResponseBuilder';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof NotFoundException) {
      const body = ResponseBuilder.error(
        exception.message,
        exception.code ?? 'NOT_FOUND',
      );
      res.status(HttpStatus.NOT_FOUND).json(body);
      return;
    }
    if (exception instanceof DomainException) {
      const body = ResponseBuilder.error(
        exception.message,
        exception.code ?? 'BAD_REQUEST',
      );
      res.status(HttpStatus.BAD_REQUEST).json(body);
      return;
    }

    if (exception && typeof exception === 'object' && 'getStatus' in exception) {
      const httpException = exception as unknown as {
        getStatus: () => number;
        getResponse?: () => unknown;
      };
      const status = httpException.getStatus();
      const response = httpException.getResponse?.();
      const message =
        typeof response === 'object' && response != null && 'message' in response
          ? String((response as { message?: unknown }).message)
          : 'Unknown error';
      const body = ResponseBuilder.error(
        Array.isArray(message) ? message.join(', ') : message,
        'HTTP_ERROR',
        response,
      );
      res.status(status).json(body);
      return;
    }

    this.logger.error(exception);
    const body = ResponseBuilder.error(
      'Internal server error',
      'INTERNAL_SERVER_ERROR',
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
