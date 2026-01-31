import { UniqueEntityId } from "./value-objects";

export interface EntityProps {
  id: UniqueEntityId;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<T extends EntityProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this.props.id;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this.id === entity.id;
  }
}
