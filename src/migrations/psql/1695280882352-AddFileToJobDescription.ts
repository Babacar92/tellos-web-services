import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddFileToJobDescription1695280882352 implements MigrationInterface {
    name = 'AddFileToJobDescription1695280882352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_job_description" ADD "file_id" integer`);
        await queryRunner.query(`ALTER TABLE "tellos_job_description" ADD CONSTRAINT "FK_a745595c4929ee5404986114786" FOREIGN KEY ("file_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_job_description" DROP CONSTRAINT "FK_a745595c4929ee5404986114786"`);
        await queryRunner.query(`ALTER TABLE "tellos_job_description" DROP COLUMN "file_id"`);
    }

}
