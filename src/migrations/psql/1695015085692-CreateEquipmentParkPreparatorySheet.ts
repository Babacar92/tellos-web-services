import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateEquipmentParkPreparatorySheet1695015085692
    implements MigrationInterface
{
    name = 'CreateEquipmentParkPreparatorySheet1695015085692';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_equipment_park_preparatory_sheet" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "equipment_park_id" integer NOT NULL, "diesel_card_returned" boolean NOT NULL, "diesel_card_returned_to_id" integer NOT NULL, "chip_removed_and_returned" boolean NOT NULL, "chip_removed_and_returned_to_id" integer NOT NULL, "original_registration_document" boolean NOT NULL, "duplicate_keys" boolean NOT NULL, "insurance_withdrawn" boolean NOT NULL, "vehicle_empty" boolean NOT NULL, "is_marking_removed" boolean NOT NULL, "starts" boolean NOT NULL, "rolling_vehicule" boolean NOT NULL, "main_works" character varying, CONSTRAINT "REL_a5324eb55cd7d462c23e31a16a" UNIQUE ("equipment_park_id"), CONSTRAINT "PK_52e6636fd8f681984015eec2660" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_a5324eb55cd7d462c23e31a16a8" FOREIGN KEY ("equipment_park_id") REFERENCES "tellos_equipment_park"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_c7df39d4ae946c8274d4a2ddab5" FOREIGN KEY ("diesel_card_returned_to_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" ADD CONSTRAINT "FK_b1f070d20c2a536a2d1c95f6ba4" FOREIGN KEY ("chip_removed_and_returned_to_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_b1f070d20c2a536a2d1c95f6ba4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_c7df39d4ae946c8274d4a2ddab5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park_preparatory_sheet" DROP CONSTRAINT "FK_a5324eb55cd7d462c23e31a16a8"`,
        );
        await queryRunner.query(
            `DROP TABLE "tellos_equipment_park_preparatory_sheet"`,
        );
    }
}
