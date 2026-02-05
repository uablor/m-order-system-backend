/**
 * Seed logging: start, complete, error.
 * Master-data only — no transactional data.
 */
const PREFIX = '[Seed]';

export const seedLogger = {
  start(name: string): void {
    console.log(`${PREFIX} Starting: ${name}`);
  },
  complete(name: string, durationMs: number): void {
    console.log(`${PREFIX} Complete: ${name} (${durationMs}ms)`);
  },
  error(name: string, err: unknown): void {
    console.error(`${PREFIX} Error in ${name}:`, err);
  },
};
