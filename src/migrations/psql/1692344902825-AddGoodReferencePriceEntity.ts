import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddGoodReferencePriceEntity1692344902825 implements MigrationInterface {
    name = 'AddGoodReferencePriceEntity1692344902825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_good_reference_price" ("id" SERIAL NOT NULL, "start_date" date NOT NULL, "end_date" date, "price" numeric(14,5), "discount" numeric(14,2), "net_price" numeric(14,5), "qty_min" integer, "executive_contract" boolean, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "work_unit_id" integer, "good_id" integer, CONSTRAINT "PK_7d30a7d184344460564b1802119" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_good_reference_price_entity" ("good_reference_price_id" integer NOT NULL, "entity_id" integer NOT NULL, CONSTRAINT "PK_5f2e5bc2732dd3b285f811f1dcd" PRIMARY KEY ("good_reference_price_id", "entity_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2a55e36ae3b2daa3abd5746aa6" ON "tellos_good_reference_price_entity" ("good_reference_price_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f7e74007d60dccb58da9696426" ON "tellos_good_reference_price_entity" ("entity_id") `);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price" ADD CONSTRAINT "FK_509e96dd3a46ba61125bc859d0d" FOREIGN KEY ("work_unit_id") REFERENCES "tellos_work_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price" ADD CONSTRAINT "FK_4d7ee097e892458b8fb4815b8e7" FOREIGN KEY ("good_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price_entity" ADD CONSTRAINT "FK_2a55e36ae3b2daa3abd5746aa60" FOREIGN KEY ("good_reference_price_id") REFERENCES "tellos_good_reference_price"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price_entity" ADD CONSTRAINT "FK_f7e74007d60dccb58da9696426a" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price_entity" DROP CONSTRAINT "FK_f7e74007d60dccb58da9696426a"`);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price_entity" DROP CONSTRAINT "FK_2a55e36ae3b2daa3abd5746aa60"`);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price" DROP CONSTRAINT "FK_4d7ee097e892458b8fb4815b8e7"`);
        await queryRunner.query(`ALTER TABLE "tellos_good_reference_price" DROP CONSTRAINT "FK_509e96dd3a46ba61125bc859d0d"`);
        await queryRunner.query(`DROP INDEX "tellos"."IDX_f7e74007d60dccb58da9696426"`);
        await queryRunner.query(`DROP INDEX "tellos"."IDX_2a55e36ae3b2daa3abd5746aa6"`);
        await queryRunner.query(`DROP TABLE "tellos_good_reference_price_entity"`);
        await queryRunner.query(`DROP TABLE "tellos_good_reference_price"`);
    }

}
