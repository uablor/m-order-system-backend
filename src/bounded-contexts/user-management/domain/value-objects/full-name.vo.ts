// full-name.vo.ts

import { ValueObject } from "src/shared/domain/value-objects";

interface FullNameProps {
  value: string;
}

export class FullName extends ValueObject<FullNameProps> {
  private constructor(props: FullNameProps) {
    super(props);
  }

  static create(name: string): FullName {
    if (!name || name.trim().length < 2) {
      throw new Error('Full name is required');
    }

    return new FullName({ value: name.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
