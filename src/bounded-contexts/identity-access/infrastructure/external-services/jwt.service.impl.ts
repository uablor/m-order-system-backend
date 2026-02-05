import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  ITokenService,
  TokenPayload,
} from '../../domain/services/token-service.port';

@Injectable()
export class JwtServiceImpl implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload as object);
  }

  async verify(token: string): Promise<TokenPayload> {
    const decoded = await this.jwtService.verifyAsync<TokenPayload>(token);
    return decoded;
  }

  decode(token: string): TokenPayload | null {
    try {
      const decoded = this.jwtService.decode(token) as TokenPayload | null;
      return decoded;
    } catch {
      return null;
    }
  }
}
