import { EntityProps } from "./entity-base";
import { UniqueEntityId } from "./value-objects";

/**
 * Base interface for domain entities.
 */


export abstract class AggregateRoot<T extends EntityProps> {
  protected readonly props: T;
  private _domainEvents: any[] = [];

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

  public get domainEvents(): any[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public equals(entity?: AggregateRoot<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this.id === entity.id;
  }
}
