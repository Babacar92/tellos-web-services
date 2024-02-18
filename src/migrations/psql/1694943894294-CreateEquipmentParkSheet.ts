import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateEquipmentParkSheet1694943894294
    implements MigrationInterface
{
    name = 'CreateEquipmentParkSheet1694943894294';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_sheet_type_enum" AS ENUM('Discount', 'Restitution', 'Control')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_sheet_thumnail_crit_air_number_enum" AS ENUM('ELECTRIC', '1', '2', '3', '4', '5')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_sheet" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "type" "tellos"."tellos_equipment_park_sheet_type_enum" NOT NULL, "return_date" TIMESTAMP NOT NULL, "user_id" integer, "contoller_id" integer, "park_number" character varying, "counter" integer, "fuel_level" character varying, "general_state" character varying, "interior_cleanliness" character varying, "exterior_cleanliness" character varying, "observation" character varying, "thumnail_crit_air" boolean, "thumnail_crit_air_number" "tellos"."tellos_equipment_park_sheet_thumnail_crit_air_number_enum", "insurance" boolean, "failure_card" boolean, "total_card" boolean, "badge" boolean, "controller_id" integer, CONSTRAINT "PK_1c1b4229123503cccf1bb55dfc2" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "FK_2c698361b9efa3eddc5a85d0a67" FOREIGN KEY ("user_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" ADD CONSTRAINT "FK_edb1eb9ea41a592e1feaebc51bc" FOREIGN KEY ("controller_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "FK_edb1eb9ea41a592e1feaebc51bc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet" DROP CONSTRAINT "FK_2c698361b9efa3eddc5a85d0a67"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_equipment_park_sheet"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_sheet_thumnail_crit_air_number_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_sheet_type_enum"`,
        );
    }
}
