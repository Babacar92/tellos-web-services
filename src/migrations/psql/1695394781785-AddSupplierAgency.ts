import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddSupplierAgency1695394781785 implements MigrationInterface {
    name = 'AddSupplierAgency1695394781785';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_supplier_agency" ("id" SERIAL NOT NULL, "supplier_id" integer NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "address_bis" character varying, "postcode" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "phone" character varying, "fax" character varying, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_0c9cba3552471700944b43774d0" UNIQUE ("name", "deleted_at"), CONSTRAINT "PK_781e6170ffad593964adaf4482c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_agency" ADD CONSTRAINT "FK_a042798de24df3955b4c9fcda14" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_agency" DROP CONSTRAINT "FK_a042798de24df3955b4c9fcda14"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_supplier_agency"`);
    }
}
