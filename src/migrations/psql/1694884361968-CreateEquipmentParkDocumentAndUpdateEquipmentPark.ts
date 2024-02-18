import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class CreateEquipmentParkDocumentAndUpdateEquipmentPark1694884361968
    implements MigrationInterface
{
    name = 'CreateEquipmentParkDocumentAndUpdateEquipmentPark1694884361968';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_document" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "title" character varying, "description" character varying, "type_id" integer, "user_id" integer, "add_date" TIMESTAMP, CONSTRAINT "PK_a59e5021ee32858a421c9817d11" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "start_date" TIMESTAMP`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "end_date" TIMESTAMP`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD CONSTRAINT "FK_b2972d0bfbac51dadb13121c5a0" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD CONSTRAINT "FK_64e780a1473097c502531fe2fd0" FOREIGN KEY ("type_id") REFERENCES "tellos_document_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" ADD CONSTRAINT "FK_b1f03187bc71a48eda809c3ac19" FOREIGN KEY ("user_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP CONSTRAINT "FK_b1f03187bc71a48eda809c3ac19"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP CONSTRAINT "FK_64e780a1473097c502531fe2fd0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_document" DROP CONSTRAINT "FK_b2972d0bfbac51dadb13121c5a0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "end_date"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "start_date"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_equipment_park_document"`);
    }
}
