import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateEquipmentParkObligations1695636161677
    implements MigrationInterface
{
    name = 'UpdateEquipmentParkObligations1695636161677';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_upload" ("equipment_park_id" integer NOT NULL, "upload_id" integer NOT NULL, CONSTRAINT "PK_0f3f969ca815625c0a4e0226ee4" PRIMARY KEY ("equipment_park_id", "upload_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_54402aeb8a0aad56af9063e1aa" ON "tellos_equipment_park_upload" ("equipment_park_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_35be91bca2446bcd0ce08e2f50" ON "tellos_equipment_park_upload" ("upload_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD "unit_of_work_id" integer NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD CONSTRAINT "UQ_a03c5cab099b341b35665f24a14" UNIQUE ("unit_of_work_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" ADD CONSTRAINT "FK_a03c5cab099b341b35665f24a14" FOREIGN KEY ("unit_of_work_id") REFERENCES "tellos_equipment_park_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_upload" ADD CONSTRAINT "FK_54402aeb8a0aad56af9063e1aa3" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_upload" ADD CONSTRAINT "FK_35be91bca2446bcd0ce08e2f504" FOREIGN KEY ("upload_id") REFERENCES "tellos_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_upload" DROP CONSTRAINT "FK_35be91bca2446bcd0ce08e2f504"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_upload" DROP CONSTRAINT "FK_54402aeb8a0aad56af9063e1aa3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP CONSTRAINT "FK_a03c5cab099b341b35665f24a14"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP CONSTRAINT "UQ_a03c5cab099b341b35665f24a14"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_obligation" DROP COLUMN "unit_of_work_id"`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_35be91bca2446bcd0ce08e2f50"`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_54402aeb8a0aad56af9063e1aa"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_equipment_park_upload"`);
    }
}
