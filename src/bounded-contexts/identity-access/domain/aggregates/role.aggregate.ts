import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface RoleAggregateProps extends EntityProps {
  name: string;
  merchantId: string | null;
  permissionIds: string[];
}

export class RoleAggregate extends AggregateRoot<RoleAggregateProps> {
  private constructor(props: RoleAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<RoleAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): RoleAggregate {
    if (!props.name?.trim()) throw new Error('Role name is required');
    return new RoleAggregate({
      ...props,
      permissionIds: props.permissionIds ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: RoleAggregateProps): RoleAggregate {
    return new RoleAggregate(props);
  }

  replacePermissions(permissionIds: string[]): void {
    (this.props as RoleAggregateProps).permissionIds = [...permissionIds];
    (this.props as RoleAggregateProps).updatedAt = new Date();
  }

  updateName(name: string): void {
    if (!name?.trim()) return;
    (this.props as RoleAggregateProps).name = name.trim();
    (this.props as RoleAggregateProps).updatedAt = new Date();
  }

  setMerchantId(merchantId: string | null): void {
    (this.props as RoleAggregateProps).merchantId = merchantId;
    (this.props as RoleAggregateProps).updatedAt = new Date();
  }

  get name(): string {
    return this.props.name;
  }

  get merchantId(): string | null {
    return this.props.merchantId;
  }

  get permissionIds(): string[] {
    return [...this.props.permissionIds];
  }
}
