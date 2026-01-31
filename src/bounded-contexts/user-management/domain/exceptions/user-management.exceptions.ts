import { DomainException } from '../../../../shared/domain/exceptions';

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`Email already registered: ${email}`, 'EMAIL_EXISTS');
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class UserInactiveException extends DomainException {
  constructor() {
    super('User is inactive', 'USER_INACTIVE');
  }
}

export class InvalidRefreshTokenException extends DomainException {
  constructor() {
    super('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
  }
}
