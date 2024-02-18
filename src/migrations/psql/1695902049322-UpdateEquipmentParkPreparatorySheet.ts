import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class UpdateEquipmentParkPreparatorySheet1695902049322
    implements MigrationInterface
{
    name = 'UpdateEquipmentParkPreparatorySheet1695902049322';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_c7df39d4ae946c8274d4a2ddab5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_b1f070d20c2a536a2d1c95f6ba4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "diesel_card_returned_to_id" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "chip_removed_and_returned_to_id" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "original_registration_document" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_c7df39d4ae946c8274d4a2ddab5" FOREIGN KEY ("diesel_card_returned_to_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_b1f070d20c2a536a2d1c95f6ba4" FOREIGN KEY ("chip_removed_and_returned_to_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_b1f070d20c2a536a2d1c95f6ba4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_c7df39d4ae946c8274d4a2ddab5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "original_registration_document" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "chip_removed_and_returned_to_id" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ALTER COLUMN "diesel_card_returned_to_id" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_b1f070d20c2a536a2d1c95f6ba4" FOREIGN KEY ("chip_removed_and_returned_to_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_c7df39d4ae946c8274d4a2ddab5" FOREIGN KEY ("diesel_card_returned_to_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
