import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AddMediumSizedCenterToEquipmentPark1695724790889
    implements MigrationInterface
{
    name = 'AddMediumSizedCenterToEquipmentPark1695724790889';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "center_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_5c4f1a039427f51791d721286fe" FOREIGN KEY ("center_id") REFERENCES "tellos_medium_size_centre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_5c4f1a039427f51791d721286fe"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "center_id"`,
        );
    }
}
