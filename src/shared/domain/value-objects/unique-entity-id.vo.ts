import { ValueObject } from './value-object';

interface UniqueEntityIdProps {
  value: string;
}

export class UniqueEntityId extends ValueObject<UniqueEntityIdProps> {
  private constructor(props: UniqueEntityIdProps) {
    super(props);
  }

  static create(id: string): UniqueEntityId {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('UniqueEntityId must be a non-empty string');
    }
    return new UniqueEntityId({ value: id.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
