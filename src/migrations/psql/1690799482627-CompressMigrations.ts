import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class CompressMigrations1690799482627 implements MigrationInterface {
  name = 'CompressMigrations1690799482627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "tellos"."tellos_equipment_type_enum" AS ENUM('Engin', 'Small equipment', 'Flotte')`,
    );
    await queryRunner.query(
      `CREATE TYPE "tellos"."tellos_equipment_available_enum" AS ENUM('Free', 'Reserved')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tellos_equipment" ("id" SERIAL NOT NULL, "denomination" character varying, "code" character varying, "registration_number" character varying, "order_number" character varying, "type" "tellos"."tellos_equipment_type_enum", "available" "tellos"."tellos_equipment_available_enum", "start_date" date, "end_date" date, "order_date" date, "delivery_date" date, "first_circulation" date, "registration_date" date, "original_value" numeric, "counter" numeric, "standard_cost" numeric, "co2_emissions" numeric, "unique_identifier" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "categorie_id" integer, "entity_id" integer, "employee_id" integer, "photo_id" integer, CONSTRAINT "PK_da0afe88bfb45884868998cde96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tellos_theoretical_hours_of_use_entity" ("id" SERIAL NOT NULL, "year" character varying, "hours_number" numeric, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_555dd708e31d2d68f2811f1da06" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "tellos"."tellos_administrative_material_financing_enum" AS ENUM('SELF_FINANCING', 'FINANCE_LEASE', 'LOAN', 'LONG_TERM_RENTAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "tellos"."tellos_administrative_material_exit_type_enum" AS ENUM('SALE', 'SCRAPPING')`,
    );
    await queryRunner.query(
      `CREATE TYPE "tellos"."tellos_administrative_material_type_of_sale_enum" AS ENUM('INTERNAL', 'EXTERNAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tellos_administrative_material" ("id" SERIAL NOT NULL, "monthly_rent" numeric, "maintenance_rent" numeric, "max_authorized_km" numeric, "buyback_value" numeric, "fixed_asset_code" numeric, "sale_price" numeric, "geolocatization_box_number" numeric, "monthly_unit_price" numeric, "tsvr_purchase" numeric, "tsvr_transfer" numeric, "total_card" numeric, "pas_sango" numeric, "breakeven_point" numeric, "utilization_rate" numeric, "comment" text, "financing" "tellos"."tellos_administrative_material_financing_enum", "exit_type" "tellos"."tellos_administrative_material_exit_type_enum", "type_of_sale" "tellos"."tellos_administrative_material_type_of_sale_enum", "pending_exit" boolean NOT NULL DEFAULT false, "car_fleet_insurance" boolean NOT NULL DEFAULT false, "machinery_insurance" boolean NOT NULL DEFAULT false, "contract_start_date" date, "contract_end_date" date, "sale_date" date, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "company_owner_id" integer, "theoretical_hour_id" integer, CONSTRAINT "PK_98db3d66f04d04815da061ee943" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tellos_equipment_document" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "start_date" date, "end_date" date, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "employee_id" integer, "document_type_id" integer, CONSTRAINT "PK_64abcc64688884119ffdf810e14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tellos_article_family" ("id" SERIAL NOT NULL, "label" character varying(255), "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "parent_id" integer, "section_code_id" integer, CONSTRAINT "PK_774217ea0d14c8fe60681227c9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" ADD "admin_material_customer_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" ADD "admin_material_person_to_notify_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" ADD CONSTRAINT "FK_5d5928a5c54cdb9f95a625d9994" FOREIGN KEY ("categorie_id") REFERENCES "tellos_category_equipment"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" ADD CONSTRAINT "FK_ca9cd5741bad5c48044022f7f7c" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" ADD CONSTRAINT "FK_caca25be78c4897dcc54bcdbec8" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" ADD CONSTRAINT "FK_48f6cad830bc5f8fa429cef3bac" FOREIGN KEY ("photo_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_administrative_material" ADD CONSTRAINT "FK_c64791dc19db60c2ae2c5d553e0" FOREIGN KEY ("company_owner_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_administrative_material" ADD CONSTRAINT "FK_8c6093ccd475e822a5312cc7490" FOREIGN KEY ("theoretical_hour_id") REFERENCES "tellos_theoretical_hours_of_use_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_document" ADD CONSTRAINT "FK_57c3e1dfd73f7320041cf6d5319" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_document" ADD CONSTRAINT "FK_105c73efc2076eb6bd507917a2c" FOREIGN KEY ("document_type_id") REFERENCES "tellos_document_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" ADD CONSTRAINT "FK_11c56cf07356437cc597f60ad72" FOREIGN KEY ("admin_material_customer_id") REFERENCES "tellos_administrative_material"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" ADD CONSTRAINT "FK_72d63f0c79a56bb8e901044f656" FOREIGN KEY ("admin_material_person_to_notify_id") REFERENCES "tellos_administrative_material"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_article_family" ADD CONSTRAINT "FK_2f1cd80e07205d5139d024a02c4" FOREIGN KEY ("parent_id") REFERENCES "tellos_article_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_article_family" ADD CONSTRAINT "FK_79eb9db7e4c96b48c3d4164041d" FOREIGN KEY ("section_code_id") REFERENCES "tellos_section_code"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tellos_article_family" DROP CONSTRAINT "FK_79eb9db7e4c96b48c3d4164041d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_article_family" DROP CONSTRAINT "FK_2f1cd80e07205d5139d024a02c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" DROP CONSTRAINT "FK_72d63f0c79a56bb8e901044f656"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" DROP CONSTRAINT "FK_11c56cf07356437cc597f60ad72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_document" DROP CONSTRAINT "FK_105c73efc2076eb6bd507917a2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_document" DROP CONSTRAINT "FK_57c3e1dfd73f7320041cf6d5319"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_administrative_material" DROP CONSTRAINT "FK_8c6093ccd475e822a5312cc7490"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_administrative_material" DROP CONSTRAINT "FK_c64791dc19db60c2ae2c5d553e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" DROP CONSTRAINT "FK_48f6cad830bc5f8fa429cef3bac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" DROP CONSTRAINT "FK_caca25be78c4897dcc54bcdbec8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" DROP CONSTRAINT "FK_ca9cd5741bad5c48044022f7f7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment" DROP CONSTRAINT "FK_5d5928a5c54cdb9f95a625d9994"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" DROP COLUMN "admin_material_person_to_notify_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_employee" DROP COLUMN "admin_material_customer_id"`,
    );
    await queryRunner.query(`DROP TABLE "tellos_article_family"`);
    await queryRunner.query(`DROP TABLE "tellos_equipment_document"`);
    await queryRunner.query(`DROP TABLE "tellos_administrative_material"`);
    await queryRunner.query(
      `DROP TYPE "tellos"."tellos_administrative_material_type_of_sale_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "tellos"."tellos_administrative_material_exit_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "tellos"."tellos_administrative_material_financing_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "tellos_theoretical_hours_of_use_entity"`,
    );
    await queryRunner.query(`DROP TABLE "tellos_equipment"`);
    await queryRunner.query(
      `DROP TYPE "tellos"."tellos_equipment_available_enum"`,
    );
    await queryRunner.query(`DROP TYPE "tellos"."tellos_equipment_type_enum"`);
  }
}
