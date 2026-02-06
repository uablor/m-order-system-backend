export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface TokenPayload {
  sub: string;
  email: string;
  merchantId?: string;
  role: string;
  permissions?: string[];
  isPlatform?: boolean;
}

export interface ITokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
  decode(token: string): TokenPayload | null;
}
