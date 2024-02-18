import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AddLoginToEquipmentParkSheet1695917294828
    implements MigrationInterface
{
    name = 'AddLoginToEquipmentParkSheet1695917294828';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "FK_edb1eb9ea41a592e1feaebc51bc"`,
        );
        await queryRunner.query(
            `ALTER TYPE "tellos"."tellos_equipment_park_sheet_type_enum" RENAME TO "tellos_equipment_park_sheet_type_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_sheet_type_enum" AS ENUM('Delivery', 'Restitution', 'Control')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ALTER COLUMN "type" TYPE "tellos"."tellos_equipment_park_sheet_type_enum" USING "type"::"text"::"tellos"."tellos_equipment_park_sheet_type_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_sheet_type_enum_old"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "FK_edb1eb9ea41a592e1feaebc51bc" FOREIGN KEY ("controller_id") REFERENCES "tellos_login"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "FK_edb1eb9ea41a592e1feaebc51bc"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_sheet_type_enum_old" AS ENUM('Control', 'Discount', 'Restitution')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ALTER COLUMN "type" TYPE "tellos"."tellos_equipment_park_sheet_type_enum_old" USING "type"::"text"::"tellos"."tellos_equipment_park_sheet_type_enum_old"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_sheet_type_enum"`,
        );
        await queryRunner.query(
            `ALTER TYPE "tellos"."tellos_equipment_park_sheet_type_enum_old" RENAME TO "tellos_equipment_park_sheet_type_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "FK_edb1eb9ea41a592e1feaebc51bc" FOREIGN KEY ("controller_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
