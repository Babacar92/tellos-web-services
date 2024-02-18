import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateGoodReferencePrice1697189180464
    implements MigrationInterface
{
    name = 'UpdateGoodReferencePrice1697189180464';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_good_reference_price" ADD "supplier_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_good_reference_price" ADD CONSTRAINT "FK_5b2b6a93283b388adc1b2f90c1d" FOREIGN KEY ("supplier_id") REFERENCES "tellos_supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_good_reference_price" DROP CONSTRAINT "FK_5b2b6a93283b388adc1b2f90c1d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_good_reference_price" DROP COLUMN "supplier_id"`,
        );
    }
}
