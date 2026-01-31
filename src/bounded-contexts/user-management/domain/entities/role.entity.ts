import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';
import type { PermissionEntity } from './permission.entity';

export interface RoleEntityProps extends EntityProps {
  roleName: string;
  description?: string;
  permissions?: PermissionEntity[];
}

export class RoleEntity extends Entity<RoleEntityProps> {
  private constructor(props: RoleEntityProps) {
    super(props);
  }

  static create(
    props: Omit<RoleEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): RoleEntity {
    return new RoleEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get roleName(): string {
    return this.props.roleName;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get permissions(): PermissionEntity[] | undefined {
    return this.props.permissions;
  }
}
