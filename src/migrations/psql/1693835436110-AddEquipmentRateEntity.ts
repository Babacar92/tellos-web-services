import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddEquipmentRateEntity1693835436110 implements MigrationInterface {
    name = 'AddEquipmentRateEntity1693835436110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_equipment_rate" ("id" SERIAL NOT NULL, "price" numeric(14,5), "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "entity_id" integer, "work_unit_id" integer, "category_equipment_id" integer, CONSTRAINT "UQ_e2354516f1624321785bde146d0" UNIQUE ("category_equipment_id", "entity_id", "deleted_at"), CONSTRAINT "PK_01728d1bb14579218356445b438" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_rate" ADD CONSTRAINT "FK_cecd1fccdf68284ab738a19e507" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_rate" ADD CONSTRAINT "FK_18edf07966e5bfdfa61e0403afc" FOREIGN KEY ("work_unit_id") REFERENCES "tellos_work_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_rate" ADD CONSTRAINT "FK_1858a6a4c61f0f028a66ab5586d" FOREIGN KEY ("category_equipment_id") REFERENCES "tellos_category_equipment"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_equipment_rate" DROP CONSTRAINT "FK_1858a6a4c61f0f028a66ab5586d"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_rate" DROP CONSTRAINT "FK_18edf07966e5bfdfa61e0403afc"`);
        await queryRunner.query(`ALTER TABLE "tellos_equipment_rate" DROP CONSTRAINT "FK_cecd1fccdf68284ab738a19e507"`);
        await queryRunner.query(`DROP TABLE "tellos_equipment_rate"`);
    }

}
