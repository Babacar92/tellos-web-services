import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AddEquipmentParkMaintenance1695795436300
    implements MigrationInterface
{
    name = 'AddEquipmentParkMaintenance1695795436300';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_maintenance_trigger_unit_enum" AS ENUM('Tonnes', 'Month', 'Hours', 'Km')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_maintenance_status_enum" AS ENUM('Todo', 'Done', 'Expired')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_maintenance" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer, "obligation_id" integer, "maintenance_number" integer NOT NULL, "operation" character varying NOT NULL, "duration" integer NOT NULL, "remark" character varying, "trigger_unit" "tellos"."tellos_equipment_park_maintenance_trigger_unit_enum", "status" "tellos"."tellos_equipment_park_maintenance_status_enum" NOT NULL DEFAULT 'Todo', CONSTRAINT "PK_d547190e9b36a9162f569f407f0" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD "user_signature_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "UQ_5bb32f367ebc4869deecbfa2f2b" UNIQUE ("user_signature_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD "controller_signature_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "UQ_25eca83d31a933759f9bd25e669" UNIQUE ("controller_signature_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "FK_5bb32f367ebc4869deecbfa2f2b" FOREIGN KEY ("user_signature_id") REFERENCES "tellos_upload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "FK_25eca83d31a933759f9bd25e669" FOREIGN KEY ("controller_signature_id") REFERENCES "tellos_upload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" ADD CONSTRAINT "FK_22365f514ea3e4f6c96f881202f" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_maintenance" DROP CONSTRAINT "FK_22365f514ea3e4f6c96f881202f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "FK_25eca83d31a933759f9bd25e669"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "FK_5bb32f367ebc4869deecbfa2f2b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "UQ_25eca83d31a933759f9bd25e669"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP COLUMN "controller_signature_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "UQ_5bb32f367ebc4869deecbfa2f2b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP COLUMN "user_signature_id"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_equipment_park_maintenance"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_maintenance_status_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_maintenance_trigger_unit_enum"`,
        );
    }
}
