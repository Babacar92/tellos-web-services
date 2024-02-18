import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateEquipmentParkObservation1694893472744
    implements MigrationInterface
{
    name = 'CreateEquipmentParkObservation1694893472744';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_observation" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "observation" character varying, "date" TIMESTAMP, CONSTRAINT "PK_84ebad3b2f16236bd4c1f053355" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_observation" ADD CONSTRAINT "FK_b54fdfbc76a3c7ae567d0e0be36" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_observation" DROP CONSTRAINT "FK_b54fdfbc76a3c7ae567d0e0be36"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_equipment_park_observation"`,
        );
    }
}
