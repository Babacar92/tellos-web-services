import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class RemoveCenterAndUpdateEquipmentAdministrative1695808884689
    implements MigrationInterface
{
    name = 'RemoveCenterAndUpdateEquipmentAdministrative1695808884689';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "FK_5c4f1a039427f51791d721286fe"`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_administrative_user_to_notify" ("equipment_administrative_id" integer NOT NULL, "employee_id" integer NOT NULL, CONSTRAINT "PK_b8802bee5ed7b982507944ab577" PRIMARY KEY ("equipment_administrative_id", "employee_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_d4c0fd73e190f906f1160e4ddb" ON "tellos_equipment_administrative_user_to_notify" ("equipment_administrative_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_eae105e5767104475188e597ce" ON "tellos_equipment_administrative_user_to_notify" ("employee_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "center_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" ADD "medium_sized_center_id" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "use_rate"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "use_rate" double precision`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative_user_to_notify" ADD CONSTRAINT "FK_d4c0fd73e190f906f1160e4ddbe" FOREIGN KEY ("equipment_administrative_id") REFERENCES "tellos_equipment_administrative"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative_user_to_notify" ADD CONSTRAINT "FK_eae105e5767104475188e597ce2" FOREIGN KEY ("employee_id") REFERENCES "tellos_employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative_user_to_notify" DROP CONSTRAINT "FK_eae105e5767104475188e597ce2"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative_user_to_notify" DROP CONSTRAINT "FK_d4c0fd73e190f906f1160e4ddbe"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" DROP COLUMN "use_rate"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_administrative" ADD "use_rate" integer`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment" DROP COLUMN "medium_sized_center_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "center_id" integer`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_eae105e5767104475188e597ce"`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_d4c0fd73e190f906f1160e4ddb"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_equipment_administrative_user_to_notify"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "FK_5c4f1a039427f51791d721286fe" FOREIGN KEY ("center_id") REFERENCES "tellos_medium_size_centre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
