// role-name.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

interface RoleNameProps {
  value: string;
}

export class RoleName extends ValueObject<RoleNameProps> {
  private constructor(props: RoleNameProps) {
    super(props);
  }

  static create(name: string): RoleName {
    if (!name || name.trim().length === 0) {
      throw new Error('Role name is required');
    }
    return new RoleName({ value: name.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
