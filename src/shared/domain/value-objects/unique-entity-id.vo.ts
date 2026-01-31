import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from './value-object';

interface UniqueEntityIdProps {
  value: string;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class UniqueEntityId extends ValueObject<UniqueEntityIdProps> {
  private constructor(props: UniqueEntityIdProps) {
    super(props);
  }

  static create(value?: string): UniqueEntityId {
    if (value) {
      if (!UUID_REGEX.test(value)) {
        throw new Error('Invalid UUID format');
      }
      return new UniqueEntityId({ value });
    }
    return new UniqueEntityId({ value: uuidv4() });
  }

  get value(): string {
    return this.props.value;
  }
}
