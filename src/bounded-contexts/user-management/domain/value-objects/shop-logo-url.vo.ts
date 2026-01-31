// shop-logo-url.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

interface ShopLogoUrlProps {
  value: string;
}

export class ShopLogoUrl extends ValueObject<ShopLogoUrlProps> {
  private constructor(props: ShopLogoUrlProps) {
    super(props);
  }

  static create(url: string): ShopLogoUrl {
    if (!url.startsWith('http')) {
      throw new Error('Invalid shop logo url');
    }
    return new ShopLogoUrl({ value: url });
  }

  get value(): string {
    return this.props.value;
  }
}
