import type { PlatformRole } from '../../domain/value-objects/platform-role.vo';

export class ChangePlatformUserRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly newRole: PlatformRole,
  ) {}
}
