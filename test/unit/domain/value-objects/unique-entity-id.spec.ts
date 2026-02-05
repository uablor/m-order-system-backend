/**
 * Domain: Value Object validation. No mocks.
 */
import { UniqueEntityId } from '../../../../src/shared/domain/value-objects/unique-entity-id.vo';

describe('UniqueEntityId', () => {
  it('creates with non-empty string', () => {
    const id = UniqueEntityId.create('a-valid-uuid');
    expect(id.value).toBe('a-valid-uuid');
  });

  it('trims whitespace', () => {
    const id = UniqueEntityId.create('  trimmed  ');
    expect(id.value).toBe('trimmed');
  });

  it('throws when empty string', () => {
    expect(() => UniqueEntityId.create('')).toThrow('UniqueEntityId must be a non-empty string');
  });

  it('throws when whitespace only', () => {
    expect(() => UniqueEntityId.create('   ')).toThrow('UniqueEntityId must be a non-empty string');
  });

  it('throws when not a string', () => {
    expect(() => UniqueEntityId.create(null as any)).toThrow();
    expect(() => UniqueEntityId.create(undefined as any)).toThrow();
  });

  it('equals same value', () => {
    const a = UniqueEntityId.create('same');
    const b = UniqueEntityId.create('same');
    expect(a.equals(b)).toBe(true);
  });

  it('not equals different value', () => {
    const a = UniqueEntityId.create('a');
    const b = UniqueEntityId.create('b');
    expect(a.equals(b)).toBe(false);
  });

  it('equals null/undefined returns false', () => {
    const a = UniqueEntityId.create('a');
    expect(a.equals(undefined)).toBe(false);
    expect(a.equals(null as any)).toBe(false);
  });
});
