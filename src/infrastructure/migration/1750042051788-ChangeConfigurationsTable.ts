import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeConfigurationsTable1750042051788 implements MigrationInterface {
    name = 'ChangeConfigurationsTable1750042051788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP FOREIGN KEY \`FK_678e52a3ef2d9a1574a9756febd\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP FOREIGN KEY \`FK_783aab04a38df98bbe0cf732564\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP COLUMN \`readingTypeId\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP COLUMN \`moduleId\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` CHANGE \`reading_type_id\` \`reading_type_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` CHANGE \`module_id\` \`module_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD CONSTRAINT \`FK_431d60d99bfa6fdde9fe5cc634e\` FOREIGN KEY (\`reading_type_id\`) REFERENCES \`tbl_reading_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD CONSTRAINT \`FK_d6b2793c59953751b9ab81128b8\` FOREIGN KEY (\`module_id\`) REFERENCES \`tbl_modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP FOREIGN KEY \`FK_d6b2793c59953751b9ab81128b8\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` DROP FOREIGN KEY \`FK_431d60d99bfa6fdde9fe5cc634e\``);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` CHANGE \`module_id\` \`module_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` CHANGE \`reading_type_id\` \`reading_type_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD \`moduleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD \`readingTypeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD CONSTRAINT \`FK_783aab04a38df98bbe0cf732564\` FOREIGN KEY (\`readingTypeId\`) REFERENCES \`tbl_reading_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_configurations\` ADD CONSTRAINT \`FK_678e52a3ef2d9a1574a9756febd\` FOREIGN KEY (\`moduleId\`) REFERENCES \`tbl_modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
