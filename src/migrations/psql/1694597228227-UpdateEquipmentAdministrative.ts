import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class UpdateAdministrative1694597228227 implements MigrationInterface {
    name = 'UpdateEquipmentAdministrative1694597228227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" RENAME COLUMN "montly_rent" TO "monthly_rent"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" RENAME COLUMN "monthly_rent" TO "montly_rent"`);
    }

}
