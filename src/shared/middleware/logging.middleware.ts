import { Request, Response, NextFunction } from 'express';
import { getAppLogger } from '../logger/app.logger';
import type { RequestWithId } from './request-id.middleware';
import type { RequestWithTiming } from './timing.middleware';

const logger = getAppLogger('HTTP');

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = (req as RequestWithTiming).startTime ?? Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const requestId = (req as RequestWithId).requestId ?? '-';
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      ?? req.socket?.remoteAddress ?? '-';

    logger.info('HTTP request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip,
      requestId,
    });
  });

  next();
}
