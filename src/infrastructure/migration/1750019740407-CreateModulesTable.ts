import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModulesTable1750019740407 implements MigrationInterface {
    name = 'CreateModulesTable1750019740407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_modules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(40) NOT NULL, \`web_socket_room\` varchar(10) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_active\` tinyint NOT NULL DEFAULT 1, \`deleted\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_db02fa65aed28522731c608c73\` (\`web_socket_room\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_db02fa65aed28522731c608c73\` ON \`tbl_modules\``);
        await queryRunner.query(`DROP TABLE \`tbl_modules\``);
    }

}
