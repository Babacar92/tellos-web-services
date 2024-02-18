import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateCategoryEquipmentParkObligation1695143485927
    implements MigrationInterface
{
    name = 'CreateCategoryEquipmentParkObligation1695143485927';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_category_equipment_park_obligation" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer, "category_id" integer, "obligation_id" integer, CONSTRAINT "PK_d9167148ca96635a3c710f68ea1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment_park_obligation" ADD CONSTRAINT "FK_deb2f217a16cbec2c5bca2d93aa" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment_park_obligation" ADD CONSTRAINT "FK_69ca1938c2c060fb71c398cf318" FOREIGN KEY ("category_id") REFERENCES "tellos_category_equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment_park_obligation" ADD CONSTRAINT "FK_88e56beaf93a2c11b89afb06056" FOREIGN KEY ("obligation_id") REFERENCES "tellos_equipment_park_obligation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment_park_obligation" DROP CONSTRAINT "FK_88e56beaf93a2c11b89afb06056"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment_park_obligation" DROP CONSTRAINT "FK_69ca1938c2c060fb71c398cf318"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_category_equipment_park_obligation" DROP CONSTRAINT "FK_deb2f217a16cbec2c5bca2d93aa"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_category_equipment_park_obligation"`,
        );
    }
}
