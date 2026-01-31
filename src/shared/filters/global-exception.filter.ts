import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  requestId?: string;
  error?: string;
}

/**
 * Global exception filter. Returns consistent format: success, message, statusCode, requestId.
 * SECURITY: Never sends stack trace or internal details to the client; only message and error name.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.requestId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as { message?: string | string[] }).message;
        message = Array.isArray(msg) ? (msg[0] ?? message) : (msg ?? message);
      } else {
        message = exception.message;
      }
      error = exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      this.logger.error(exception.message, exception.stack);
    }

    // Never include stack or internal details in response (security)
    const body: ErrorResponse = {
      success: false,
      message,
      statusCode: status,
      requestId,
      error,
    };

    response.status(status).json(body);
  }
}
