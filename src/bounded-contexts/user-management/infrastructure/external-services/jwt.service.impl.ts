import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import type { ITokenService, TokenPayload } from '../../domain/services/token.service.port';

@Injectable()
export class JwtServiceImpl implements ITokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  signAccess(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRY ?? '15m' });
  }

  signRefresh(payload: { sub: string }): string {
    const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? 'change-me';
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: process.env.JWT_REFRESH_EXPIRY ?? '7d',
    });
  }

  verifyAccess(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }

  verifyRefresh(token: string): { sub: string } {
    const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? 'change-me';
    return this.jwtService.verify<{ sub: string }>(token, { secret });
  }
}
