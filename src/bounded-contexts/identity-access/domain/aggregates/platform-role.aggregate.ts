import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { DomainException } from '../../../../shared/domain/exceptions';

export interface PlatformRoleAggregateProps extends EntityProps {
  name: string;
}

export class PlatformRoleAggregate extends AggregateRoot<PlatformRoleAggregateProps> {
  private constructor(props: PlatformRoleAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<PlatformRoleAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): PlatformRoleAggregate {
    if (!props.name?.trim()) {
      throw new DomainException('Platform role name is required', 'PLATFORM_ROLE_NAME_REQUIRED');
    }
    return new PlatformRoleAggregate({
      ...props,
      name: props.name.trim(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: PlatformRoleAggregateProps): PlatformRoleAggregate {
    return new PlatformRoleAggregate(props);
  }

  get name(): string {
    return this.props.name;
  }

  updateName(name: string): void {
    if (!name?.trim()) return;
    (this.props as PlatformRoleAggregateProps).name = name.trim();
    (this.props as PlatformRoleAggregateProps).updatedAt = new Date();
  }
}
