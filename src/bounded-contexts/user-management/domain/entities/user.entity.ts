import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import type { RoleEntity } from './role.entity';

export interface UserEntityProps extends EntityProps {
  email: string;
  passwordHash: string;
  fullName: string;
  roleId: string;
  merchantId: string;
  isActive: boolean;
  lastLogin?: Date;
  role?: { roleName: string };
}

export class UserEntity extends AggregateRoot<UserEntityProps> {
  private constructor(props: UserEntityProps) {
    super(props);
  }

  static create(
    props: Omit<UserEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): UserEntity {
    return new UserEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get merchantId(): string {
    return this.props.merchantId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastLogin(): Date | undefined {
    return this.props.lastLogin;
  }

  get role(): { roleName: string } | undefined {
    return this.props.role;
  }
}
