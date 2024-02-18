import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddDivisionFactorToWorkUnit1691157206308 implements MigrationInterface {
    name = 'AddDivisionFactorToWorkUnit1691157206308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_work_entity" ADD "division_factor" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_work_entity" DROP COLUMN "division_factor"`);
    }

}
