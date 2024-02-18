import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddGoodEntity1691762604146 implements MigrationInterface {
    name = 'AddGoodEntity1691762604146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tellos"."tellos_good_status_enum" AS ENUM('ENABLED', 'DISABLED')`);
        await queryRunner.query(`CREATE TABLE "tellos_good" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_bis" character varying, "shop_good" boolean NOT NULL DEFAULT false, "status" "tellos"."tellos_good_status_enum", "ean" character varying, "length_size" numeric(20,2), "width_size" numeric(20,2), "height_size" numeric(20,2), "volume" numeric(20,2), "gross_weight" numeric(20,2), "net_weight" numeric(20,2), "technical_description" text, "selection_active" boolean NOT NULL DEFAULT false, "stock_management" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "work_unit_id" integer, "section_code_id" integer, "parent_family_id" integer, "sub_family_id" integer, CONSTRAINT "UQ_6eead3b06219c312e6ca1853780" UNIQUE ("name", "deleted_at"), CONSTRAINT "PK_32dd9526244bf2a4429ae7cc6c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_good" ADD CONSTRAINT "FK_1d774fa49abbf069250d0c7beda" FOREIGN KEY ("work_unit_id") REFERENCES "tellos_work_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_good" ADD CONSTRAINT "FK_bc329cf7fe0af819a87692489b3" FOREIGN KEY ("section_code_id") REFERENCES "tellos_section_code"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_good" ADD CONSTRAINT "FK_c39dceba027830188ffe1c351b9" FOREIGN KEY ("parent_family_id") REFERENCES "tellos_article_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_good" ADD CONSTRAINT "FK_2449a2977e2b851d4babcdef27c" FOREIGN KEY ("sub_family_id") REFERENCES "tellos_article_family"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_good" DROP CONSTRAINT "FK_2449a2977e2b851d4babcdef27c"`);
        await queryRunner.query(`ALTER TABLE "tellos_good" DROP CONSTRAINT "FK_c39dceba027830188ffe1c351b9"`);
        await queryRunner.query(`ALTER TABLE "tellos_good" DROP CONSTRAINT "FK_bc329cf7fe0af819a87692489b3"`);
        await queryRunner.query(`ALTER TABLE "tellos_good" DROP CONSTRAINT "FK_1d774fa49abbf069250d0c7beda"`);
        await queryRunner.query(`DROP TABLE "tellos_good"`);
        await queryRunner.query(`DROP TYPE "tellos"."tellos_good_status_enum"`);
    }

}
