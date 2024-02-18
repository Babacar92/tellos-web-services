import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateEquipmentParkPreparatorySheet1695823007347
    implements MigrationInterface
{
    name = 'UpdateEquipmentParkPreparatorySheet1695823007347';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "diesel_card_returned" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "duplicate_keys" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "insurance_withdrawn" DROP NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "insurance_withdrawn" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "duplicate_keys" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "diesel_card_returned" SET NOT NULL`,
        );
    }
}
