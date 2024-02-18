import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddSupplierNote1695366589909 implements MigrationInterface {
    name = 'AddSupplierNote1695366589909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_supplier_note" ("id" SERIAL NOT NULL, "comment" text, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "supplier_id" integer, "login_id" integer, CONSTRAINT "PK_daa4d486b9f1dd39495320d04ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tellos_supplier_note_documents_upload" ("supplier_note_id" integer NOT NULL, "upload_id" integer NOT NULL, CONSTRAINT "PK_6a62ee1d0bfd384f16ef3134f77" PRIMARY KEY ("supplier_note_id", "upload_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22cd79c47915603c24b3f2ecfd" ON "tellos_supplier_note_documents_upload" ("supplier_note_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c072883d346d10316ada3eb21b" ON "tellos_supplier_note_documents_upload" ("upload_id") `);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note" ADD CONSTRAINT "FK_2466b30163822aced9bc00878e6" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note" ADD CONSTRAINT "FK_5bd1f2a771758584ce0f8a9c03a" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note_documents_upload" ADD CONSTRAINT "FK_22cd79c47915603c24b3f2ecfd9" FOREIGN KEY ("supplier_note_id") REFERENCES "tellos_supplier_note"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note_documents_upload" ADD CONSTRAINT "FK_c072883d346d10316ada3eb21bb" FOREIGN KEY ("upload_id") REFERENCES "tellos_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note_documents_upload" DROP CONSTRAINT "FK_c072883d346d10316ada3eb21bb"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note_documents_upload" DROP CONSTRAINT "FK_22cd79c47915603c24b3f2ecfd9"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note" DROP CONSTRAINT "FK_5bd1f2a771758584ce0f8a9c03a"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_note" DROP CONSTRAINT "FK_2466b30163822aced9bc00878e6"`);
        await queryRunner.query(`DROP INDEX "tellos"."IDX_c072883d346d10316ada3eb21b"`);
        await queryRunner.query(`DROP INDEX "tellos"."IDX_22cd79c47915603c24b3f2ecfd"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_note_documents_upload"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_note"`);
    }

}
