import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export interface PermissionEntityProps extends EntityProps {
  permissionCode: string;
  description?: string;
}

export class PermissionEntity extends Entity<PermissionEntityProps> {
  private constructor(props: PermissionEntityProps) {
    super(props);
  }

  static create(
    props: Omit<PermissionEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): PermissionEntity {
    return new PermissionEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get permissionCode(): string {
    return this.props.permissionCode;
  }

  get description(): string | undefined {
    return this.props.description;
  }
}
