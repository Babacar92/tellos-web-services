import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class CreateEquipmentFunding1694072531705 implements MigrationInterface {
  name = 'CreateEquipmentFunding1694072531705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_f746930729fbd66e3e2ce126a24"`,
    );
    await queryRunner.query(
      `CREATE TABLE "tellos_equipment_funding" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8f808dd7fdbfd2a00ee8adc413f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_park" ALTER COLUMN "employee_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_f746930729fbd66e3e2ce126a24" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_f746930729fbd66e3e2ce126a24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_park" ALTER COLUMN "employee_id" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "tellos_equipment_funding"`);
    await queryRunner.query(
      `ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_f746930729fbd66e3e2ce126a24" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
