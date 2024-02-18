import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateEquipmentAdministrative1695371950819
    implements MigrationInterface
{
    name = 'UpdateEquipmentAdministrative1695371950819';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "customer_as_costumer_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_37c9da3ffd9da718d30df2f9348" FOREIGN KEY ("customer_as_customer_id") REFERENCES "tellos_customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_37c9da3ffd9da718d30df2f9348"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "customer_as_costumer_id" integer`,
        );
    }
}
