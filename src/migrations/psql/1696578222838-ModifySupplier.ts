import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class ModifySupplier1696578222838 implements MigrationInterface {
    name = 'ModifySupplier1696578222838';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_26c31e229b09b4f46c74c075b1b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP COLUMN "total_outstanding"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP COLUMN "authorized_outstanding"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP COLUMN "vat_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD "vat" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD "total_out_standing" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD "authorized_out_standing" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ALTER COLUMN "name" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_material_pricing" ALTER COLUMN "article_purchase_price" TYPE numeric`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_material_pricing" ALTER COLUMN "article_discount_price" TYPE numeric`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_material_pricing" ALTER COLUMN "article_net_price" TYPE numeric`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_6fd758fe4b7e2e6f7b9f206f470" UNIQUE ("name", "deleted_at")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_209a5c24228518e22132c299415" UNIQUE ("vat", "deleted_at")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_209a5c24228518e22132c299415"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP CONSTRAINT "UQ_6fd758fe4b7e2e6f7b9f206f470"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_material_pricing" ALTER COLUMN "article_net_price" TYPE numeric`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_material_pricing" ALTER COLUMN "article_discount_price" TYPE numeric`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier_material_pricing" ALTER COLUMN "article_purchase_price" TYPE numeric`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ALTER COLUMN "name" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP COLUMN "authorized_out_standing"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP COLUMN "total_out_standing"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" DROP COLUMN "vat"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD "vat_id" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD "authorized_outstanding" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD "total_outstanding" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_supplier" ADD CONSTRAINT "UQ_26c31e229b09b4f46c74c075b1b" UNIQUE ("deleted_at", "vat_id")`,
        );
    }
}
