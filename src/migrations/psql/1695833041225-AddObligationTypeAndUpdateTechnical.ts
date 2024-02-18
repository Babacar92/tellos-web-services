import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AddObligationTypeAndUpdateTechnical1695833041225
    implements MigrationInterface
{
    name = 'AddObligationTypeAndUpdateTechnical1695833041225';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" RENAME COLUMN "label" TO "label_id"`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_obligation_type" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_768d91a2eb1ed8b9483c00c15fe" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" DROP COLUMN "medium_sized_center_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "road_speed" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "engine" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP COLUMN "label_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD "label_id" integer NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "engine_serial_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "engine_serial_number" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "box_serial_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "box_serial_number" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD CONSTRAINT "FK_39721da5282a48dfefba63a4bb0" FOREIGN KEY ("label_id") REFERENCES "tellos_obligation_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP CONSTRAINT "FK_39721da5282a48dfefba63a4bb0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "box_serial_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "box_serial_number" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "engine_serial_number"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "engine_serial_number" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP COLUMN "label_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD "label_id" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "engine"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "road_speed"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" ADD "medium_sized_center_id" integer`,
        );
        await queryRunner.query(`DROP TABLE "tellos_obligation_type"`);
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" RENAME COLUMN "label_id" TO "label"`,
        );
    }
}
