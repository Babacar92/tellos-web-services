import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class CreateEquipmentTechnical1694594217762 implements MigrationInterface {
    name = 'CreateEquipmentTechnical1694594217762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_equipment_technical_thumbnail" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_2f345754b4e55ae6c426c5a3998" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_equipment_technical_genre" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_1ef91b32a22d00a4d84e323621b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "tellos"."tellos_equipment_technical_tires_type_enum" AS ENUM('Tire', 'Caterpillar', '')`);
        await queryRunner.query(`CREATE TABLE "tellos_equipment_technical" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "tires_type" "tellos"."tellos_equipment_technical_tires_type_enum", "tonnage" integer, "genre_id" integer, "thumbnail_crit_air_id" integer, "brand" character varying, "type" character varying, "series" character varying, "sheet_metal" character varying, "immobilizer_code" integer, "power" integer, "seats" integer, "consumption" integer, "ptac" integer, "pv" integer, "ptra" integer, "energy" character varying, "engine_serial_number" integer, "box" character varying, "box_serial_number" integer, "length" integer, "width" integer, "height" integer, CONSTRAINT "REL_ee0e1f31c59745cbdb3f5e366a" UNIQUE ("equipment_park_id"), CONSTRAINT "PK_c69e79ca0e59c716f2f5a3e795e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_ee0e1f31c59745cbdb3f5e366a6" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_1ef91b32a22d00a4d84e323621b" FOREIGN KEY ("genre_id") REFERENCES "tellos_equipment_technical_genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_f14a43242e0975e3e3e0f8728b7" FOREIGN KEY ("thumbnail_crit_air_id") REFERENCES "tellos_equipment_technical_thumbnail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_f14a43242e0975e3e3e0f8728b7"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_1ef91b32a22d00a4d84e323621b"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_ee0e1f31c59745cbdb3f5e366a6"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_technical"`);
        await queryRunner.query(`DROP TYPE "tellos"."tellos_equipment_technical_tires_type_enum"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_technical_genre"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_technical_thumbnail"`);
    }

}
