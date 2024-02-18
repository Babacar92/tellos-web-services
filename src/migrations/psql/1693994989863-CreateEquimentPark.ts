import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class CreateEquimentPark1693994989863 implements MigrationInterface {
    name = 'CreateEquimentPark1693994989863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tellos"."tellos_equipment_park_type_enum" AS ENUM('Engin', 'Small equipment', 'Flotte')`);
        await queryRunner.query(`CREATE TABLE "tellos_equipment_park" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "denomination" character varying NOT NULL, "registration_number" character varying, "category_id" integer NOT NULL, "entity_id" integer NOT NULL, "order_number" character varying, "order_date" date, "delivery_date" date, "first_circulation" date, "registration_date" date, "original_value" integer, "counter" integer, "standard_cost" integer, "co2_emission" integer, "type" "tellos"."tellos_equipment_park_type_enum", "employee_id" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "unique_identifier" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_89a4286b6d0531de86e736e9041" UNIQUE ("unique_identifier"), CONSTRAINT "PK_f092f681bedbf7356936b157e26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_equipment_assignment" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "employee_id" integer NOT NULL, "start_date" date NOT NULL, "end_date" date, CONSTRAINT "PK_aa79653cdb09e6781bd405c9ca9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_8cfae915c415990d51280319d89" FOREIGN KEY ("category_id") REFERENCES "tellos_category_equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_975e341277a1f846a6913c0bac4" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_f746930729fbd66e3e2ce126a24" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_assignment" ADD CONSTRAINT "FK_acbe11f71a377347f1c477dbde9" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_assignment" ADD CONSTRAINT "FK_a054e9eedad4175f1137bbbc31c" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_assignment" DROP CONSTRAINT "FK_a054e9eedad4175f1137bbbc31c"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_assignment" DROP CONSTRAINT "FK_acbe11f71a377347f1c477dbde9"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_f746930729fbd66e3e2ce126a24"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_975e341277a1f846a6913c0bac4"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_8cfae915c415990d51280319d89"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_assignment"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_park"`);
        await queryRunner.query(`DROP TYPE "tellos"."tellos_equipment_park_type_enum"`);
    }

}
