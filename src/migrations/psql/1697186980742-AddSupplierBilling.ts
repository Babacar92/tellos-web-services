import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AddSupplierBilling1697186980742 implements MigrationInterface {
    name = 'AddSupplierBilling1697186980742';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_supplier_billing_currency_enum" AS ENUM('EUR')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_supplier_billing_conditions_enum" AS ENUM('FREE_DELIVERY', 'EXTRA', 'PICKUP', 'CASH_ON_DELIVERY')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_supplier_billing_delivery_mode_enum" AS ENUM('TAILGATE_REQUIRED', 'TARPAULIN', 'PLATEAU', 'DUMP')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_supplier_billing" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "supplier_id" integer NOT NULL, "login_id" integer NOT NULL, "tax_code" bigint, "regulation_code" bigint, "currency" "tellos"."tellos_supplier_billing_currency_enum" DEFAULT 'EUR', "rib" bigint, "billing_address" character varying, "iban" bigint, "bic" bigint, "discount_rate" integer, "bank_rate" integer, "minimum_order" integer, "conditions" "tellos"."tellos_supplier_billing_conditions_enum", "delivery_mode" "tellos"."tellos_supplier_billing_delivery_mode_enum", "credit_insurer" boolean DEFAULT false, "insurer_name" character varying, "intra_group" boolean DEFAULT false, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_06f6debf86c2b495a3f3fda8505" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_billing" ADD CONSTRAINT "FK_fdae2eff35d60de3f0b3109772d" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_billing" ADD CONSTRAINT "FK_8f098028ec134dfc0502bedfdc0" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_billing" DROP CONSTRAINT "FK_8f098028ec134dfc0502bedfdc0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_billing" DROP CONSTRAINT "FK_fdae2eff35d60de3f0b3109772d"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_supplier_billing"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_supplier_billing_delivery_mode_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_supplier_billing_conditions_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_supplier_billing_currency_enum"`,
        );
    }
}
