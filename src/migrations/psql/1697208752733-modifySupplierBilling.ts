import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class modifySupplierBilling1697208752733 implements MigrationInterface {
    name = 'modifySupplierBilling1697208752733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier_billing" DROP CONSTRAINT "FK_8f098028ec134dfc0502bedfdc0"`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_billing" DROP COLUMN "login_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_supplier_billing" ADD "login_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tellos_supplier_billing" ADD CONSTRAINT "FK_8f098028ec134dfc0502bedfdc0" FOREIGN KEY ("login_id") REFERENCES "tellos_login"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
