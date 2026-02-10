import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1770739578157 implements MigrationInterface {
    name = 'SchemaSync1770739578157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`description\` \`description\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`merchant_id\` \`merchant_id\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` CHANGE \`owner_user_id\` \`owner_user_id\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`contact_phone\` \`contact_phone\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`contact_email\` \`contact_email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`arrived_at\` \`arrived_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`notified_at\` \`notified_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`arrival_items\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`arrivals\` CHANGE \`arrived_time\` \`arrived_time\` time NULL`);
        await queryRunner.query(`ALTER TABLE \`arrivals\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`notification_link\` \`notification_link\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`last_retry_at\` \`last_retry_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`sent_at\` \`sent_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`error_message\` \`error_message\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`related_orders\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`related_orders\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`payment_proof_url\` \`payment_proof_url\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`payment_at\` \`payment_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`customer_message\` \`customer_message\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`verified_by\` \`verified_by\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`verified_at\` \`verified_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`rejected_by\` \`rejected_by\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`rejected_at\` \`rejected_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`reject_reason\` \`reject_reason\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`notes\` \`notes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_messages\` CHANGE \`order_id\` \`order_id\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_messages\` CHANGE \`file_url\` \`file_url\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_messages\` CHANGE \`read_at\` \`read_at\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_messages\` CHANGE \`read_at\` \`read_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customer_messages\` CHANGE \`file_url\` \`file_url\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customer_messages\` CHANGE \`order_id\` \`order_id\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`reject_reason\` \`reject_reason\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`rejected_at\` \`rejected_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`rejected_by\` \`rejected_by\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`verified_at\` \`verified_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`verified_by\` \`verified_by\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`customer_message\` \`customer_message\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`payment_at\` \`payment_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`payment_proof_url\` \`payment_proof_url\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`related_orders\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`related_orders\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`error_message\` \`error_message\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`sent_at\` \`sent_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`last_retry_at\` \`last_retry_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`notification_link\` \`notification_link\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`arrivals\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`arrivals\` CHANGE \`arrived_time\` \`arrived_time\` time NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`arrival_items\` CHANGE \`notes\` \`notes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`notified_at\` \`notified_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`arrived_at\` \`arrived_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`contact_email\` \`contact_email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`contact_phone\` \`contact_phone\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`merchants\` CHANGE \`owner_user_id\` \`owner_user_id\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`merchant_id\` \`merchant_id\` char(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`description\` \`description\` varchar(500) NULL DEFAULT 'NULL'`);
    }

}
