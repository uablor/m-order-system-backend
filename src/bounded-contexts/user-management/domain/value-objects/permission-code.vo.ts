import { ValueObject } from 'src/shared/domain/value-objects';

interface PermissionCodeProps {
  value: string;
}

export class PermissionCode extends ValueObject<PermissionCodeProps> {
  private constructor(props: PermissionCodeProps) {
    super(props);
  }

  static create(value: string): PermissionCode {
    return new PermissionCode({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
