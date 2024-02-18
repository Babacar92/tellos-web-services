import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateGood1697607943136 implements MigrationInterface {
    name = 'UpdateGood1697607943136';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_good" ADD "supplier_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_good" ADD CONSTRAINT "FK_7d3a35503ccba6d8883689809e3" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_good" DROP CONSTRAINT "FK_7d3a35503ccba6d8883689809e3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_good" DROP COLUMN "supplier_id"`,
        );
    }
}
