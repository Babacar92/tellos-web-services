import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class CreateEquipmentAdministration1694156197727 implements MigrationInterface {
    name = 'CreateEquipmentAdministration1694156197727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tellos"."tellos_equipment_administrative_exit_type_enum" AS ENUM('Mise au rebus', 'Vente')`);
        await queryRunner.query(`CREATE TYPE "tellos"."tellos_equipment_administrative_sell_type_enum" AS ENUM('Internal', 'External')`);
        await queryRunner.query(`CREATE TABLE "tellos_equipment_administrative" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "owner_company_id" integer, "funding_id" integer, "montly_rent" integer, "maintenance_rent" integer, "max_allowed_km" integer, "contract_start_date" TIMESTAMP, "contract_end_date" TIMESTAMP, "buy_back_value" integer, "immobilization_code" integer, "exit_type" "tellos"."tellos_equipment_administrative_exit_type_enum", "mutation_date" TIMESTAMP, "sell_type" "tellos"."tellos_equipment_administrative_sell_type_enum", "customer_as_customer_id" integer, "customer_as_entity_id" integer, "selling_price" integer, "waiting_for_release" boolean, "geolocation_box_number" integer, "geolocation_box_monthly_cost" integer, "geolocation_contract_start_date" TIMESTAMP, "geolocation_contract_end_date" TIMESTAMP, "t_svr_purchase" integer, "t_svr_cession" integer, "total_card" integer, "ango_pass" integer, "car_fleet_insurance" boolean, "machine_breakdown_insurance" boolean, "break_event" integer, "use_rate" integer, "nb_hours_entered" integer, "comment" character varying, "customer_as_costumer_id" integer, CONSTRAINT "REL_8da9664af66b252c279c8d43aa" UNIQUE ("equipment_park_id"), CONSTRAINT "REL_aafcb84b0279b2a2d288c4b1d0" UNIQUE ("owner_company_id"), CONSTRAINT "PK_f6bd44f9d8c2aa320f9a4802e4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_employee" ADD "equipment_adminisrative_id" integer`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_8da9664af66b252c279c8d43aa3" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_aafcb84b0279b2a2d288c4b1d0b" FOREIGN KEY ("owner_company_id") REFERENCES "tellos_owner_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_0716ee467b450c21585ec572df8" FOREIGN KEY ("funding_id") REFERENCES "tellos_equipment_funding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_090215797ff523a980f89468dd3" FOREIGN KEY ("customer_as_costumer_id") REFERENCES "tellos_customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_7a874481eec3fb67ed5ab7763ba" FOREIGN KEY ("customer_as_entity_id") REFERENCES "tellos_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_employee" ADD CONSTRAINT "FK_e760092f5df139e3e2699bceba6" FOREIGN KEY ("equipment_adminisrative_id") REFERENCES "tellos_equipment_administrative"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_employee" DROP CONSTRAINT "FK_e760092f5df139e3e2699bceba6"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_7a874481eec3fb67ed5ab7763ba"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_090215797ff523a980f89468dd3"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_0716ee467b450c21585ec572df8"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_aafcb84b0279b2a2d288c4b1d0b"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_8da9664af66b252c279c8d43aa3"`);
        await queryRunner.query(`ALTER TABLE "tellos_employee" DROP COLUMN "equipment_adminisrative_id"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_administrative"`);
        await queryRunner.query(`DROP TYPE "tellos"."tellos_equipment_administrative_sell_type_enum"`);
        await queryRunner.query(`DROP TYPE "tellos"."tellos_equipment_administrative_exit_type_enum"`);
    }

}
