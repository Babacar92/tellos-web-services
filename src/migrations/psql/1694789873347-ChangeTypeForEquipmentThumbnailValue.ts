import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class ChangeTypeForEquipmentThumbnailValue1694789873347 implements MigrationInterface {
    name = 'ChangeTypeForEquipmentThumbnailValue1694789873347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical_thumbnail" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical_thumbnail" ADD "value" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical_thumbnail" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical_thumbnail" ADD "value" integer NOT NULL`);
    }

}
