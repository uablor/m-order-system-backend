import type { EntityManager } from 'typeorm';

let currentManager: EntityManager | null = null;

export function setTransactionManager(manager: EntityManager | null): void {
  currentManager = manager;
}

export function getTransactionManager(): EntityManager | null {
  return currentManager;
}
