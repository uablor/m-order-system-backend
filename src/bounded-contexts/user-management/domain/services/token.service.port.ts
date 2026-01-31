export interface TokenPayload {
  sub: string;
  email: string;
  merchantId?: string;
  roleName: string;
  iat?: number;
  exp?: number;
}

export interface ITokenService {
  signAccess(payload: Omit<TokenPayload, 'iat' | 'exp'>): string;
  signRefresh(payload: Pick<TokenPayload, 'sub'>): string;
  verifyAccess(token: string): TokenPayload;
  verifyRefresh(token: string): { sub: string };
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
