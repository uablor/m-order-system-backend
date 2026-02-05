import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface PermissionAggregateProps extends EntityProps {
  code: string;
  name: string;
  description?: string;
}

export class PermissionAggregate extends AggregateRoot<PermissionAggregateProps> {
  private constructor(props: PermissionAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<PermissionAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): PermissionAggregate {
    if (!props.code?.trim()) throw new Error('Permission code is required');
    if (!props.name?.trim()) throw new Error('Permission name is required');
    return new PermissionAggregate({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: PermissionAggregateProps): PermissionAggregate {
    return new PermissionAggregate(props);
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }
}
