// shop-name.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

interface ShopNameProps {
  value: string;
}

export class ShopName extends ValueObject<ShopNameProps> {
  private constructor(props: ShopNameProps) {
    super(props);
  }

  static create(name: string): ShopName {
    if (!name || name.trim().length < 2) {
      throw new Error('Shop name is required');
    }
    return new ShopName({ value: name.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
