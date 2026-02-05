import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    // Optional: attach request-scoped auth context here; JWT validated by guard
    next();
  }
}
