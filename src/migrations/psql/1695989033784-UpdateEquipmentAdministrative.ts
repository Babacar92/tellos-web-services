import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateEquipmentAdministrative1695989033784
    implements MigrationInterface
{
    name = 'UpdateEquipmentAdministrative1695989033784';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" DROP COLUMN "trigger_unit"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_maintenance_trigger_unit_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_maintenance_unit_of_work_enum" AS ENUM('Tonnes', 'Month', 'Hours', 'Km')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" ADD "unit_of_work" "tellos"."tellos_equipment_park_maintenance_unit_of_work_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" ADD "trigger_date" TIMESTAMP`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" ADD "trigger_number" double precision`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" DROP COLUMN "trigger_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" DROP COLUMN "trigger_date"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" DROP COLUMN "unit_of_work"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_maintenance_unit_of_work_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_maintenance_trigger_unit_enum" AS ENUM('Hours', 'Km', 'Month', 'Tonnes')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" ADD "trigger_unit" "tellos"."tellos_equipment_park_maintenance_trigger_unit_enum"`,
        );
    }
}
