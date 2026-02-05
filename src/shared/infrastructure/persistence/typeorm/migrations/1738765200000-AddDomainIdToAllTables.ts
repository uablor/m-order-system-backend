import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * DDD 2-ID Model: Add domain_id (business identity) to all tables.
 * Backfill from current PK. Keeps existing UUID PK for FK integrity.
 * Technical id (bigint) can be added in a later migration if needed.
 */
export class AddDomainIdToAllTables1738765200000 implements MigrationInterface {
  name = 'AddDomainIdToAllTables1738765200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: { table: string; pkColumn: string }[] = [
      { table: 'permissions', pkColumn: 'id' },
      { table: 'roles', pkColumn: 'id' },
      { table: 'users', pkColumn: 'id' },
      { table: 'merchants', pkColumn: 'id' },
      { table: 'customers', pkColumn: 'id' },
      { table: 'exchange_rates', pkColumn: 'rate_id' },
      { table: 'orders', pkColumn: 'order_id' },
      { table: 'order_items', pkColumn: 'item_id' },
      { table: 'customer_orders', pkColumn: 'customer_order_id' },
      { table: 'customer_order_items', pkColumn: 'id' },
      { table: 'arrivals', pkColumn: 'arrival_id' },
      { table: 'arrival_items', pkColumn: 'arrival_item_id' },
      { table: 'notifications', pkColumn: 'notification_id' },
      { table: 'payments', pkColumn: 'payment_id' },
      { table: 'customer_messages', pkColumn: 'message_id' },
    ];

    for (const { table, pkColumn } of tables) {
      await queryRunner.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`domain_id\` char(36) NULL`,
      );
      await queryRunner.query(
        `UPDATE \`${table}\` SET \`domain_id\` = \`${pkColumn}\``,
      );
      await queryRunner.query(
        `ALTER TABLE \`${table}\` MODIFY COLUMN \`domain_id\` char(36) NOT NULL`,
      );
      await queryRunner.query(
        `CREATE UNIQUE INDEX \`IDX_${table}_domain_id\` ON \`${table}\` (\`domain_id\`)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'permissions',
      'roles',
      'users',
      'merchants',
      'customers',
      'exchange_rates',
      'orders',
      'order_items',
      'customer_orders',
      'customer_order_items',
      'arrivals',
      'arrival_items',
      'notifications',
      'payments',
      'customer_messages',
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP INDEX \`IDX_${table}_domain_id\` ON \`${table}\``);
      await queryRunner.query(`ALTER TABLE \`${table}\` DROP COLUMN \`domain_id\``);
    }
  }
}
