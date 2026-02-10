import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlatformRolePermissions1738820000000 implements MigrationInterface {
  name = 'PlatformRolePermissions1738820000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`platform_role_permissions\` (\`platform_role_id\` char(36) NOT NULL, \`permission_id\` char(36) NOT NULL, PRIMARY KEY (\`platform_role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`platform_role_permissions\``);
  }
}
