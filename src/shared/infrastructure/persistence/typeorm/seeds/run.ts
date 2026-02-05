/**
 * Seed runner: run all seeds or a specific one, in a transaction.
 * Usage: pnpm db:seed [seedName]
 * Example: pnpm db:seed 001-permissions
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedLogger } from './logger';
import { Seed } from './types';
import { masterSeeds } from './master';

async function runSeed(dataSource: DataSource, seed: Seed): Promise<void> {
  const start = Date.now();
  seedLogger.start(seed.name);
  try {
    await seed.run(dataSource);
    seedLogger.complete(seed.name, Date.now() - start);
  } catch (err) {
    seedLogger.error(seed.name, err);
    throw err;
  }
}

async function main(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dataSourceModule = require('../data-source');
  const dataSource = new DataSource(dataSourceModule.default.options);
  await dataSource.initialize();

  const seedName = process.argv[2];
  const toRun = seedName
    ? masterSeeds.filter((s) => s.name === seedName)
    : masterSeeds;

  if (toRun.length === 0) {
    if (seedName) {
      console.error(`[Seed] No seed named "${seedName}". Available: ${masterSeeds.map((s) => s.name).join(', ')}`);
    } else {
      console.error('[Seed] No seeds registered.');
    }
    process.exit(1);
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  const transactionalDataSource = {
    ...dataSource,
    manager: queryRunner.manager,
    getRepository: (entity: Parameters<DataSource['getRepository']>[0]) =>
      queryRunner.manager.getRepository(entity as any),
  } as DataSource;
  try {
    for (const seed of toRun) {
      await runSeed(transactionalDataSource, seed);
    }
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error('[Seed] Fatal:', err);
  process.exit(1);
});
