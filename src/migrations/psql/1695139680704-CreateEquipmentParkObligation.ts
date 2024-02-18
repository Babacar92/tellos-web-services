import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateEquipmentParkObligation1695139680704
    implements MigrationInterface
{
    name = 'CreateEquipmentParkObligation1695139680704';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_obligation_type_enum" AS ENUM('Legal', 'Internal')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_obligation_trigger_unit_enum" AS ENUM('Counter', 'Date')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_obligation" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "type" "tellos"."tellos_equipment_park_obligation_type_enum" NOT NULL, "label" character varying NOT NULL, "periodicity" integer NOT NULL, "trigger_unit" "tellos"."tellos_equipment_park_obligation_trigger_unit_enum" NOT NULL, "maintenance_duration" integer NOT NULL, "document_required" boolean NOT NULL, "last_control_date" TIMESTAMP, "next_control_date" TIMESTAMP, "last_control_counter" integer, "next_control_counter" integer, CONSTRAINT "PK_2334356cff600f0bc754f5a08e3" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "tellos_equipment_park_obligation"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_obligation_trigger_unit_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_obligation_type_enum"`,
        );
    }
}
