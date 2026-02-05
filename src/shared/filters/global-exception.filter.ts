import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException, NotFoundException } from '../domain/exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof NotFoundException) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        code: exception.code,
      });
      return;
    }
    if (exception instanceof DomainException) {
      const status = HttpStatus.BAD_REQUEST;
      res.status(status).json({
        statusCode: status,
        message: exception.message,
        code: exception.code,
      });
      return;
    }

    if (exception && typeof exception === 'object' && 'getStatus' in exception) {
      const httpException = exception as unknown as {
        getStatus: () => number;
        getResponse?: () => unknown;
      };
      const status = httpException.getStatus();
      const response = httpException.getResponse?.();
      res.status(status).json(response ?? { message: 'Unknown error' });
      return;
    }

    this.logger.error(exception);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
