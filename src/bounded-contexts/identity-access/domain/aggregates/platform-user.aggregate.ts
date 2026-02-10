import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Email } from '../value-objects/email.vo';
import type { PlatformRole } from '../value-objects/platform-role.vo';

export interface PlatformUserAggregateProps extends EntityProps {
  email: Email;
  passwordHash: string;
  fullName: string;
  role: PlatformRole;
  isActive: boolean;
}

export class PlatformUserAggregate extends AggregateRoot<PlatformUserAggregateProps> {
  private constructor(props: PlatformUserAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<PlatformUserAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): PlatformUserAggregate {
    if (!props.email) throw new Error('Email is required');
    if (!props.passwordHash) throw new Error('Password hash is required');
    if (!props.role) throw new Error('Role is required');
    
    return new PlatformUserAggregate({
      ...props,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: PlatformUserAggregateProps): PlatformUserAggregate {
    return new PlatformUserAggregate(props);
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get role(): PlatformRole {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  updateProfile(fullName: string): void {
    if (!fullName?.trim()) return;
    (this.props as PlatformUserAggregateProps).fullName = fullName.trim();
    (this.props as PlatformUserAggregateProps).updatedAt = new Date();
  }

  changeRole(newRole: PlatformRole): void {
    (this.props as PlatformUserAggregateProps).role = newRole;
    (this.props as PlatformUserAggregateProps).updatedAt = new Date();
  }

  deactivate(): void {
    (this.props as PlatformUserAggregateProps).isActive = false;
    (this.props as PlatformUserAggregateProps).updatedAt = new Date();
  }

  activate(): void {
    (this.props as PlatformUserAggregateProps).isActive = true;
    (this.props as PlatformUserAggregateProps).updatedAt = new Date();
  }

  changePassword(newHash: string): void {
    (this.props as PlatformUserAggregateProps).passwordHash = newHash;
    (this.props as PlatformUserAggregateProps).updatedAt = new Date();
  }
}
