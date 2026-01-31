import { UniqueEntityId } from 'src/shared/domain/value-objects';
import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { IPasswordHasher } from '../services/password-hasher.port';
import { Email, Password } from '../value-objects';
import type { RoleEntity } from './role.entity';
import { FullName } from '../value-objects/full-name.vo';

export interface UserEntityProps extends EntityProps {
  email: Email;
  passwordHash: Password;
  fullName: FullName;
  roleId: UniqueEntityId;
  merchantId: UniqueEntityId;
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
      id: UniqueEntityId.create(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static async createWithPassword(
    props: Omit<UserEntityProps, 'passwordHash' | 'id' | 'isActive'>,
    password: string,
    hasher: IPasswordHasher,
  ) {
    const hash = await hasher.hash(password);
    return new UserEntity({
      ...props,
      id: UniqueEntityId.create(),
      passwordHash: Password.fromHash(hash),
      isActive: true,
    });
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): Password {
    return this.props.passwordHash;
  }

  get fullName(): FullName {
    return this.props.fullName;
  }

  get roleId(): UniqueEntityId {
    return this.props.roleId;
  }

  get merchantId(): UniqueEntityId {
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
