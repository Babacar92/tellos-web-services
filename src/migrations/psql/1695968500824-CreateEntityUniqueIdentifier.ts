import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateEntityUniqueIdentifier1695968500824
    implements MigrationInterface
{
    name = 'CreateEntityUniqueIdentifier1695968500824';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tellos_entity_unique_identifier" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "entity_id" integer NOT NULL, "identifier" integer NOT NULL, CONSTRAINT "REL_0b7123aba247db200c859bacbd" UNIQUE ("entity_id"), CONSTRAINT "PK_8e5247de3a5db4ad661ddf78e6d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP CONSTRAINT "UQ_89a4286b6d0531de86e736e9041"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" DROP COLUMN "unique_identifier"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_entity_unique_identifier" ADD CONSTRAINT "FK_0b7123aba247db200c859bacbde" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_entity_unique_identifier" DROP CONSTRAINT "FK_0b7123aba247db200c859bacbde"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD "unique_identifier" integer NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_equipment_park" ADD CONSTRAINT "UQ_89a4286b6d0531de86e736e9041" UNIQUE ("unique_identifier")`,
        );
        await queryRunner.query(`DROP TABLE "tellos_entity_unique_identifier"`);
    }
}
