import type { PlatformRole } from '../../domain/value-objects/platform-role.vo';

export class UpdatePlatformUserCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      fullName?: string;
      role?: PlatformRole;
      isActive?: boolean;
      password?: string;
    },
  ) {}
}
