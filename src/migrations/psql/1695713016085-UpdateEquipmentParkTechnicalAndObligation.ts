import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateEquipmentParkTechnicalAndObligation1695713016085
    implements MigrationInterface
{
    name = 'UpdateEquipmentParkTechnicalAndObligation1695713016085';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_8da9664af66b252c279c8d43aa3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP CONSTRAINT "FK_a03c5cab099b341b35665f24a14"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_ee0e1f31c59745cbdb3f5e366a6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP CONSTRAINT "UQ_a03c5cab099b341b35665f24a14"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP COLUMN "unit_of_work_id"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_unit_of_work_enum" AS ENUM('Tonnes', 'Month', 'Hours', 'Km')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "unit_of_work" "tellos"."tellos_equipment_park_unit_of_work_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_equipment_park_obligation_status_enum" AS ENUM('Todo', 'Done', 'Expired')`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD "status" "tellos"."tellos_equipment_park_obligation_status_enum" NOT NULL DEFAULT 'Todo'`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "pneumatic_type_one_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "quantity_one" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "pneumatic_type_two_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "quantity_two" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "gearbox_lubricant_type_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "gearbox_lubricant_quantity" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "bridge_lubricant_type_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "bridge_lubricant_quantity" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "engine_lubricant_type_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "engine_lubricant_quantity" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "da_lubricant_type_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "da_lubricant_quantity" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "hydrolic_oil_type_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD "hydrolic_oil_quantity" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ALTER COLUMN "maintenance_duration" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_8da9664af66b252c279c8d43aa3" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_ee0e1f31c59745cbdb3f5e366a6" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_cb68a85e683979af53d9f4cdb7b" FOREIGN KEY ("pneumatic_type_one_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_795d1ec28515488e68f074adf64" FOREIGN KEY ("pneumatic_type_two_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_a81b8a0ebefdb1b1756203727a8" FOREIGN KEY ("gearbox_lubricant_type_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_73acc76e8d725bc32ba5aa5c0c2" FOREIGN KEY ("bridge_lubricant_type_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_7f3ef1712a102485977fc6f423a" FOREIGN KEY ("engine_lubricant_type_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_0aa1cc74fa0140ca1b9963d5c16" FOREIGN KEY ("da_lubricant_type_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_ce1a24a88c8d911bf8cbfc22b51" FOREIGN KEY ("hydrolic_oil_type_id") REFERENCES "tellos_good"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_ce1a24a88c8d911bf8cbfc22b51"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_0aa1cc74fa0140ca1b9963d5c16"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_7f3ef1712a102485977fc6f423a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_73acc76e8d725bc32ba5aa5c0c2"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_a81b8a0ebefdb1b1756203727a8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_795d1ec28515488e68f074adf64"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_cb68a85e683979af53d9f4cdb7b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP CONSTRAINT "FK_ee0e1f31c59745cbdb3f5e366a6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP CONSTRAINT "FK_8da9664af66b252c279c8d43aa3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ALTER COLUMN "maintenance_duration" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "hydrolic_oil_quantity"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "hydrolic_oil_type_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "da_lubricant_quantity"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "da_lubricant_type_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "engine_lubricant_quantity"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "engine_lubricant_type_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "bridge_lubricant_quantity"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "bridge_lubricant_type_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "gearbox_lubricant_quantity"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "gearbox_lubricant_type_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "quantity_two"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "pneumatic_type_two_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "quantity_one"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" DROP COLUMN "pneumatic_type_one_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP COLUMN "status"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_obligation_status_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "unit_of_work"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_equipment_park_unit_of_work_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD "unit_of_work_id" integer NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD CONSTRAINT "UQ_a03c5cab099b341b35665f24a14" UNIQUE ("unit_of_work_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_technical" ADD CONSTRAINT "FK_ee0e1f31c59745cbdb3f5e366a6" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD CONSTRAINT "FK_a03c5cab099b341b35665f24a14" FOREIGN KEY ("unit_of_work_id") REFERENCES "tellos_equipment_park_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD CONSTRAINT "FK_8da9664af66b252c279c8d43aa3" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
