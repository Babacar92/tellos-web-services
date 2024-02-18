import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class UpdateCategoryEquipmentEntity1693925935112 implements MigrationInterface {
    name = 'UpdateCategoryEquipmentEntity1693925935112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_category_equipment" DROP CONSTRAINT "FK_0c241c87cca241260fed8e2b7e0"`);
        await queryRunner.query(`ALTER TABLE "tellos_category_equipment" DROP COLUMN "cost_price"`);
        await queryRunner.query(`ALTER TABLE "tellos_category_equipment" DROP COLUMN "work_unit_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_category_equipment" ADD "work_unit_id" integer`);
        await queryRunner.query(`ALTER TABLE "tellos_category_equipment" ADD "cost_price" numeric(20,2)`);
        await queryRunner.query(`ALTER TABLE "tellos_category_equipment" ADD CONSTRAINT "FK_0c241c87cca241260fed8e2b7e0" FOREIGN KEY ("work_unit_id") REFERENCES "tellos_work_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
