import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import type { EntityProps } from '../../../../shared/domain/entity-base';

export interface MerchantAggregateProps extends EntityProps {
  shopName: string;
  defaultCurrency: string;
  isActive: boolean;
  ownerUserId?: string;
}

export class MerchantAggregate extends AggregateRoot<MerchantAggregateProps> {
  private constructor(props: MerchantAggregateProps) {
    super(props);
  }

  static create(
    props: Omit<MerchantAggregateProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): MerchantAggregate {
    if (!props.shopName?.trim()) throw new Error('Shop name is required');
    if (!props.defaultCurrency?.trim()) throw new Error('Default currency is required');
    return new MerchantAggregate({
      ...props,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  static fromPersistence(props: MerchantAggregateProps): MerchantAggregate {
    return new MerchantAggregate(props);
  }

  get shopName(): string {
    return this.props.shopName;
  }

  get defaultCurrency(): string {
    return this.props.defaultCurrency;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get ownerUserId(): string | undefined {
    return this.props.ownerUserId;
  }

  setOwnerUser(userId: string): void {
    (this.props as MerchantAggregateProps).ownerUserId = userId;
    (this.props as MerchantAggregateProps).updatedAt = new Date();
  }

  deactivate(): void {
    (this.props as MerchantAggregateProps).isActive = false;
    (this.props as MerchantAggregateProps).updatedAt = new Date();
  }

  activate(): void {
    (this.props as MerchantAggregateProps).isActive = true;
    (this.props as MerchantAggregateProps).updatedAt = new Date();
  }

  updateProfile(shopName: string, defaultCurrency: string): void {
    if (shopName?.trim()) (this.props as MerchantAggregateProps).shopName = shopName.trim();
    if (defaultCurrency?.trim())
      (this.props as MerchantAggregateProps).defaultCurrency = defaultCurrency.trim();
    (this.props as MerchantAggregateProps).updatedAt = new Date();
  }
}
