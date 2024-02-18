import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class ResetSupplierMigration1695288055088 implements MigrationInterface {
    name = 'ResetSupplierMigration1695288055088';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_business_document" ("id" SERIAL NOT NULL, "label" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "business_id" integer, "type_id" integer, "classification_id" integer, "login_id" integer, "file_id" integer, CONSTRAINT "PK_32c412f532007399d5902f4d7f1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_supplier_language_code" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, CONSTRAINT "PK_9d96cd460dc062d4e9309aee245" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_supplier" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "code" integer NOT NULL, "name" character varying, "address" character varying, "address_bis" character varying, "cp" character varying NOT NULL, "city" character varying, "country" character varying, "observation" character varying, "phone" character varying, "fax" character varying, "siret" character varying NOT NULL, "ape" character varying NOT NULL, "vat" integer NOT NULL, "account_balance" integer, "order_book" integer, "non_invoiced_delivery" integer, "total_outstanding" integer, "authorized_outstanding" integer, "collective_account" character varying, "client_name" character varying, "order_date" date, "order_number" character varying, "category_id" integer, "language_code_id" integer, CONSTRAINT "UQ_0b60ad419ea5c941d5d7df5aec6" UNIQUE ("code"), CONSTRAINT "PK_9d8118f3f721e9ae465f010848a" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" ADD CONSTRAINT "FK_dc24c666c3c3800fb64d522b2be" FOREIGN KEY ("business_id") REFERENCES "tellos_business"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" ADD CONSTRAINT "FK_86682a7055424dbf9173c6fbcd3" FOREIGN KEY ("type_id") REFERENCES "tellos_business_document_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" ADD CONSTRAINT "FK_09ac8c8a80ab50952afca74257a" FOREIGN KEY ("classification_id") REFERENCES "tellos_business_document_classification"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" ADD CONSTRAINT "FK_5742e1fdeb4aa53aa82e3d58f4d" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" ADD CONSTRAINT "FK_2365a2653a342bebc20295a4717" FOREIGN KEY ("file_id") REFERENCES "tellos_upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD CONSTRAINT "FK_522a7796ab3864346048fcb8059" FOREIGN KEY ("category_id") REFERENCES "tellos_supplier_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD CONSTRAINT "FK_9d96cd460dc062d4e9309aee245" FOREIGN KEY ("language_code_id") REFERENCES "tellos_supplier_language_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP CONSTRAINT "FK_9d96cd460dc062d4e9309aee245"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP CONSTRAINT "FK_522a7796ab3864346048fcb8059"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" DROP CONSTRAINT "FK_2365a2653a342bebc20295a4717"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" DROP CONSTRAINT "FK_5742e1fdeb4aa53aa82e3d58f4d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" DROP CONSTRAINT "FK_09ac8c8a80ab50952afca74257a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" DROP CONSTRAINT "FK_86682a7055424dbf9173c6fbcd3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_business_document" DROP CONSTRAINT "FK_dc24c666c3c3800fb64d522b2be"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_supplier"`);
        await queryRunner.query(`DROP TABLE "tellos_supplier_language_code"`);
        await queryRunner.query(`DROP TABLE "tellos_business_document"`);
    }
}
