import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1769853046791 implements MigrationInterface {
    name = 'SchemaSync1769853046791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`UQ_merchants_domain_id\` ON \`merchants\``);
        await queryRunner.query(`DROP INDEX \`UQ_customers_domain_id\` ON \`customers\``);
        await queryRunner.query(`DROP INDEX \`IDX_customers_merchant_id\` ON \`customers\``);
        await queryRunner.query(`DROP INDEX \`UQ_orders_domain_id\` ON \`orders\``);
        await queryRunner.query(`DROP INDEX \`IDX_orders_merchant_id\` ON \`orders\``);
        await queryRunner.query(`DROP INDEX \`IDX_orders_order_date\` ON \`orders\``);
        await queryRunner.query(`DROP INDEX \`FK_role_permissions_permission_id\` ON \`role_permissions\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`owner_name\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`owner_user_id\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`shop_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`shop_logo_url\` varchar(1024) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`shop_address\` varchar(1024) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`contact_phone\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`contact_email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`contact_facebook\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`contact_line\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`contact_whatsapp\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`default_currency\` varchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_e18b0544c532dab81b229d0d3b\` (\`domain_id\`)`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_f65dbbe5dc253ff51e8a1f894d\` (\`permission_code\`)`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_b2aef658765c9b59c454d56177\` (\`domain_id\`)`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_ac35f51a0f17e3e1fe12112603\` (\`role_name\`)`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_b07612fc9ab8c40bf34f0dcfe6\` (\`domain_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`last_login\` \`last_login\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD UNIQUE INDEX \`IDX_ce3bb67cb0926240e65c08cd1b\` (\`domain_id\`)`);
        await queryRunner.query(`ALTER TABLE \`merchants\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`merchants\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD UNIQUE INDEX \`IDX_28a79a3a8385dff6fb94b4c4e9\` (\`domain_id\`)`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`phone\` \`phone\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`address\` \`address\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD UNIQUE INDEX \`IDX_06a04a826023e654bcfd58ebff\` (\`domain_id\`)`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`IDX_178199805b901ccd220ab7740e\` ON \`role_permissions\` (\`role_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_17022daf3f885f7d35423e9971\` ON \`role_permissions\` (\`permission_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`domain_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_178199805b901ccd220ab7740ec\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`domain_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_17022daf3f885f7d35423e9971e\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`domain_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_17022daf3f885f7d35423e9971e\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_178199805b901ccd220ab7740ec\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`DROP INDEX \`IDX_17022daf3f885f7d35423e9971\` ON \`role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_178199805b901ccd220ab7740e\` ON \`role_permissions\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP INDEX \`IDX_06a04a826023e654bcfd58ebff\``);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`address\` \`address\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`phone\` \`phone\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP INDEX \`IDX_28a79a3a8385dff6fb94b4c4e9\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`merchants\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP INDEX \`IDX_ce3bb67cb0926240e65c08cd1b\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`last_login\` \`last_login\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_b07612fc9ab8c40bf34f0dcfe6\``);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP INDEX \`IDX_ac35f51a0f17e3e1fe12112603\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP INDEX \`IDX_b2aef658765c9b59c454d56177\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP INDEX \`IDX_f65dbbe5dc253ff51e8a1f894d\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP INDEX \`IDX_e18b0544c532dab81b229d0d3b\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`is_active\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`default_currency\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`contact_whatsapp\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`contact_line\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`contact_facebook\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`contact_email\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`contact_phone\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`shop_address\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`shop_logo_url\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`shop_name\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` DROP COLUMN \`owner_user_id\``);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`owner_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`merchants\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`FK_role_permissions_permission_id\` ON \`role_permissions\` (\`permission_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_orders_order_date\` ON \`orders\` (\`order_date\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_orders_merchant_id\` ON \`orders\` (\`merchant_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_orders_domain_id\` ON \`orders\` (\`domain_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_customers_merchant_id\` ON \`customers\` (\`merchant_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_customers_domain_id\` ON \`customers\` (\`domain_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_merchants_domain_id\` ON \`merchants\` (\`domain_id\`)`);
    }

}
