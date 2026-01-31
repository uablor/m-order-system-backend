import { Request, Response, NextFunction } from 'express';

export interface RequestWithTiming extends Request {
  startTime?: number;
}

export function timingMiddleware(
  req: RequestWithTiming,
  _res: Response,
  next: NextFunction,
): void {
  req.startTime = Date.now();
  next();
}
