import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateEquipmentPark1695305625884 implements MigrationInterface {
    name = 'UpdateEquipmentPark1695305625884';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_sheet_upload" ("equipment_park_sheet_id" integer NOT NULL, "upload_id" integer NOT NULL, CONSTRAINT "PK_37b329ede2c16d48e65df1f3f04" PRIMARY KEY ("equipment_park_sheet_id", "upload_id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_4429af2e42aa3e69f78674ece4" ON "tellos_equipment_park_sheet_upload" ("equipment_park_sheet_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_70b935daa92958cb93936b13dc" ON "tellos_equipment_park_sheet_upload" ("upload_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet_upload" ADD CONSTRAINT "FK_4429af2e42aa3e69f78674ece46" FOREIGN KEY ("equipment_park_sheet_id") REFERENCES "tellos_equipment_park_sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet_upload" ADD CONSTRAINT "FK_70b935daa92958cb93936b13dca" FOREIGN KEY ("upload_id") REFERENCES "tellos_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet_upload" DROP CONSTRAINT "FK_70b935daa92958cb93936b13dca"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_sheet_upload" DROP CONSTRAINT "FK_4429af2e42aa3e69f78674ece46"`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_70b935daa92958cb93936b13dc"`,
        );
        await queryRunner.query(
            `DROP INDEX "tellos"."IDX_4429af2e42aa3e69f78674ece4"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_equipment_park_sheet_upload"`,
        );
    }
}
