import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConfigurationsTable1750040710170 implements MigrationInterface {
    name = 'CreateConfigurationsTable1750040710170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_configurations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`min_value\` decimal(10,2) NOT NULL DEFAULT '0.00', \`max_value\` decimal(10,2) NOT NULL DEFAULT '0.00', \`reading_type_id\` int NOT NULL, \`module_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted\` tinyint NOT NULL DEFAULT 0, \`readingTypeId\` int NULL, \`moduleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD CONSTRAINT \`FK_783aab04a38df98bbe0cf732564\` FOREIGN KEY (\`readingTypeId\`) REFERENCES \`tbl_reading_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD CONSTRAINT \`FK_678e52a3ef2d9a1574a9756febd\` FOREIGN KEY (\`moduleId\`) REFERENCES \`tbl_modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP FOREIGN KEY \`FK_678e52a3ef2d9a1574a9756febd\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP FOREIGN KEY \`FK_783aab04a38df98bbe0cf732564\``);
        await queryRunner.query(`DROP TABLE \`tbl_configurations\``);
    }

}
