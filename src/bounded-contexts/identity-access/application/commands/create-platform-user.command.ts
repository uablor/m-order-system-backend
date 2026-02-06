import type { PlatformRole } from '../../domain/value-objects/platform-role.vo';

export class CreatePlatformUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly fullName: string,
    public readonly role: PlatformRole,
  ) {}
}
