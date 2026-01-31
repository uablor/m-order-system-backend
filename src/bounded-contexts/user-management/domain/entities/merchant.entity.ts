import { Currency, UniqueEntityId } from 'src/shared/domain/value-objects';
import type { EntityProps } from '../../../../shared/domain/entity-base';
import { Entity } from '../../../../shared/domain/entity-base';
import { ShopName } from '../value-objects/shop-name.vo';
import { ShopLogoUrl } from '../value-objects/shop-logo-url.vo';
import { ContactPhone } from '../value-objects/contact-phone.vo';
import { Email } from '../value-objects';
import { SocialLink } from '../value-objects/social-link.vo';
import { Address } from '../value-objects/address.vo';

export enum DefaultCurrency {
  USD = 'USD',
  KHR = 'KHR',
}

export interface MerchantEntityProps extends EntityProps {
  ownerUserId: UniqueEntityId;
  shopName: ShopName;
  shopLogoUrl?: ShopLogoUrl;
  shopAddress?: Address;
  contactPhone?: ContactPhone;
  contactEmail?: Email;
  contactFacebook?: SocialLink;
  contactLine?: SocialLink;
  contactWhatsapp?: SocialLink;
  defaultCurrency: Currency;
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

  get ownerUserId(): UniqueEntityId {
    return this.props.ownerUserId;
  }
  get shopName(): ShopName {
    return this.props.shopName;
  }
  get shopLogoUrl(): ShopLogoUrl | undefined {
    return this.props.shopLogoUrl;
  }
  get shopAddress(): Address | undefined {
    return this.props.shopAddress;
  }
  get contactPhone(): ContactPhone | undefined {
    return this.props.contactPhone;
  }
  get contactEmail(): Email | undefined {
    return this.props.contactEmail;
  }
  get contactFacebook(): SocialLink | undefined {
    return this.props.contactFacebook;
  }
  get contactLine(): SocialLink | undefined {
    return this.props.contactLine;
  }
  get contactWhatsapp(): SocialLink | undefined {
    return this.props.contactWhatsapp;
  }
  get defaultCurrency(): Currency {
    return this.props.defaultCurrency;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
}
