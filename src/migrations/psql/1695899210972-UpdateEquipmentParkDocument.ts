import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class UpdateEquipmentParkDocument1695899210972
    implements MigrationInterface
{
    name = 'UpdateEquipmentParkDocument1695899210972';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" RENAME COLUMN "add_date" TO "file_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP COLUMN "file_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD "file_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP CONSTRAINT "FK_b1f03187bc71a48eda809c3ac19"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD CONSTRAINT "FK_b1f03187bc71a48eda809c3ac19" FOREIGN KEY ("user_id") REFERENCES "tellos_login"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD CONSTRAINT "FK_0628fd0562994c28b7e2f0c3e71" FOREIGN KEY ("file_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP CONSTRAINT "FK_0628fd0562994c28b7e2f0c3e71"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP CONSTRAINT "FK_b1f03187bc71a48eda809c3ac19"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP COLUMN "file_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD "file_id" TIMESTAMP`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" RENAME COLUMN "file_id" TO "add_date"`,
        );
    }
}
