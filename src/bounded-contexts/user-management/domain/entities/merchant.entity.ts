import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';

export enum DefaultCurrency {
  USD = 'USD',
  KHR = 'KHR',
}

export interface MerchantEntityProps extends EntityProps {
  ownerUserId: string;
  shopName: string;
  shopLogoUrl?: string;
  shopAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactFacebook?: string;
  contactLine?: string;
  contactWhatsapp?: string;
  defaultCurrency: DefaultCurrency;
  isActive: boolean;
}

export class MerchantEntity extends Entity<MerchantEntityProps> {
  private constructor(props: MerchantEntityProps) {
    super(props);
  }

  static create(
    props: Omit<MerchantEntityProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): MerchantEntity {
    return new MerchantEntity({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get ownerUserId(): string {
    return this.props.ownerUserId;
  }
  get shopName(): string {
    return this.props.shopName;
  }
  get shopLogoUrl(): string | undefined {
    return this.props.shopLogoUrl;
  }
  get shopAddress(): string | undefined {
    return this.props.shopAddress;
  }
  get contactPhone(): string | undefined {
    return this.props.contactPhone;
  }
  get contactEmail(): string | undefined {
    return this.props.contactEmail;
  }
  get contactFacebook(): string | undefined {
    return this.props.contactFacebook;
  }
  get contactLine(): string | undefined {
    return this.props.contactLine;
  }
  get contactWhatsapp(): string | undefined {
    return this.props.contactWhatsapp;
  }
  get defaultCurrency(): DefaultCurrency {
    return this.props.defaultCurrency;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
}
