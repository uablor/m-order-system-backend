import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface UserAggregateProps extends EntityProps {
  email: string;
  passwordHash: string;
  fullName: string;
  merchantId: string;
  roleId: string;
  isActive: boolean;
}

export class UserAggregate extends AggregateRoot<UserAggregateProps> {
  private constructor(props: UserAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<UserAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): UserAggregate {
    if (!props.email?.trim()) throw new Error('Email is required');
    if (!props.passwordHash) throw new Error('Password hash is required');
    if (!props.merchantId) throw new Error('User must belong to a merchant');
    if (!props.roleId) throw new Error('User must have a role');
    return new UserAggregate({
      ...props,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: UserAggregateProps): UserAggregate {
    return new UserAggregate(props);
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

  get merchantId(): string {
    return this.props.merchantId;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  deactivate(): void {
    (this.props as UserAggregateProps).isActive = false;
    (this.props as UserAggregateProps).updatedAt = new Date();
  }

  activate(): void {
    (this.props as UserAggregateProps).isActive = true;
    (this.props as UserAggregateProps).updatedAt = new Date();
  }

  updateProfile(fullName: string): void {
    (this.props as UserAggregateProps).fullName = fullName;
    (this.props as UserAggregateProps).updatedAt = new Date();
  }

  changePassword(newHash: string): void {
    (this.props as UserAggregateProps).passwordHash = newHash;
    (this.props as UserAggregateProps).updatedAt = new Date();
  }

  assignRole(roleId: string): void {
    (this.props as UserAggregateProps).roleId = roleId;
    (this.props as UserAggregateProps).updatedAt = new Date();
  }
}
