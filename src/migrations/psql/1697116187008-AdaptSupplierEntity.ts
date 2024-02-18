import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AdaptSupplierEntity1697116187008 implements MigrationInterface {
    name = 'AdaptSupplierEntity1697116187008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "total_out_standing"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "order_date"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "non_invoiced_delivery"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "order_book"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "account_balance"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "order_number"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "collective_account"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_334465ce9e0012518e61a69041b"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "siret"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "siret" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_334465ce9e0012518e61a69041b" UNIQUE ("siret", "deleted_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_334465ce9e0012518e61a69041b"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "siret"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "siret" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_334465ce9e0012518e61a69041b" UNIQUE ("deleted_at", "siret")`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "collective_account" character varying`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "order_number" character varying`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "account_balance" integer`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "order_book" integer`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "non_invoiced_delivery" integer`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "order_date" date`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier" ADD "total_out_standing" integer`);
    }

}
