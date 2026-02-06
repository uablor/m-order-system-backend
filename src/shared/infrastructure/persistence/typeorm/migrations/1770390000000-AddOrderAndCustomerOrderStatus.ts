import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Draft workflow: add explicit status columns for orders and customer_orders.
 * Backfill orders.status from legacy is_closed flag.
 */
export class AddOrderAndCustomerOrderStatus1770390000000 implements MigrationInterface {
  name = 'AddOrderAndCustomerOrderStatus1770390000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `orders` ADD COLUMN `status` varchar(32) NOT NULL DEFAULT 'DRAFT'",
    );
    await queryRunner.query(
      "UPDATE `orders` SET `status` = 'CLOSED' WHERE `is_closed` = true",
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_orders_merchant_status` ON `orders` (`merchant_id`, `status`)',
    );

    await queryRunner.query(
      "ALTER TABLE `customer_orders` ADD COLUMN `status` varchar(32) NOT NULL DEFAULT 'DRAFT'",
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_customer_orders_customer_status` ON `customer_orders` (`customer_id`, `status`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_customer_orders_merchant_status` ON `customer_orders` (`merchant_id`, `status`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_customer_orders_merchant_status` ON `customer_orders`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_customer_orders_customer_status` ON `customer_orders`',
    );
    await queryRunner.query('ALTER TABLE `customer_orders` DROP COLUMN `status`');

    await queryRunner.query(
      'DROP INDEX `IDX_orders_merchant_status` ON `orders`',
    );
    await queryRunner.query('ALTER TABLE `orders` DROP COLUMN `status`');
  }
}

