import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddSupplierEvaluation1695390447695 implements MigrationInterface {
    name = 'AddSupplierEvaluation1695390447695';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_supplier_evaluation" ("id" SERIAL NOT NULL, "supplier_id" integer NOT NULL, "login_id" integer NOT NULL, "comment" text, "note" integer NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "PK_74c3c4e3c029b8ac87cf6198a07" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_note" DROP CONSTRAINT "FK_2466b30163822aced9bc00878e6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_note" ALTER COLUMN "supplier_id" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_evaluation" ADD CONSTRAINT "FK_d7789cfc1cb467270acb9d260db" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_evaluation" ADD CONSTRAINT "FK_2a388f8036846cfb67ae711554d" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_note" ADD CONSTRAINT "FK_2466b30163822aced9bc00878e6" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_note" DROP CONSTRAINT "FK_2466b30163822aced9bc00878e6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_evaluation" DROP CONSTRAINT "FK_2a388f8036846cfb67ae711554d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_evaluation" DROP CONSTRAINT "FK_d7789cfc1cb467270acb9d260db"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_note" ALTER COLUMN "supplier_id" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_note" ADD CONSTRAINT "FK_2466b30163822aced9bc00878e6" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`DROP TABLE "tellos_supplier_evaluation"`);
    }
}
