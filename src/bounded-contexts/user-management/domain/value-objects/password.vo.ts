import { ValueObject } from '../../../../shared/domain/value-objects';

interface PasswordProps {
  hash?: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static fromHash(hash: string): Password {
    if (!hash?.trim()) throw new Error('Password hash is required');
    return new Password({ hash: hash.trim() });
  }

  get hash(): string {
    if (!this.props.hash) throw new Error('Password hash not set');
    return this.props.hash;
  }

  hasHash(): boolean {
    return !!this.props.hash;
  }
}
