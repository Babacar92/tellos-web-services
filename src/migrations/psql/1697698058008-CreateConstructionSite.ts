import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class CreateConstructionSite1697698058008 implements MigrationInterface {
    name = 'CreateConstructionSite1697698058008';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_construction_site_type_enum" AS ENUM('construction_site', 'sub_construction_site')`,
        );
        await queryRunner.query(
            `CREATE TYPE "tellos"."tellos_construction_site_status_enum" AS ENUM('admin_phase', 'inactive', 'in_progress')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tellos_construction_site" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "code" character varying NOT NULL, "type" "tellos"."tellos_construction_site_type_enum" NOT NULL, "from_id" integer, "label" character varying NOT NULL, "place" character varying, "nature" character varying, "entity_id" integer NOT NULL, "submitted_to_general_fees" boolean DEFAULT true, "construction_forecast" boolean DEFAULT true, "commands" integer, "incomes" integer, "expenses" integer, "billings" integer, "opening_case_date" date, "start_date" date, "end_date" date, "closing_date" date, "status" "tellos"."tellos_construction_site_status_enum", "dict_date" TIMESTAMP, "dict_reference" character varying, "circulation_date" TIMESTAMP, "circulation_ref" character varying, "risk_from_id" integer, "risk_comment" character varying, CONSTRAINT "REL_b809eaf034d24047e31fdd11c9" UNIQUE ("from_id"), CONSTRAINT "PK_fb73863eaa5a517fec2d7e4b899" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_construction_site" ADD CONSTRAINT "FK_b809eaf034d24047e31fdd11c94" FOREIGN KEY ("from_id") REFERENCES "tellos_construction_site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_construction_site" ADD CONSTRAINT "FK_14da3eb031271a19297765fc737" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_construction_site" ADD CONSTRAINT "FK_a08fd08756e86657ec122124ca5" FOREIGN KEY ("risk_from_id") REFERENCES "tellos_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_construction_site" DROP CONSTRAINT "FK_a08fd08756e86657ec122124ca5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_construction_site" DROP CONSTRAINT "FK_14da3eb031271a19297765fc737"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_construction_site" DROP CONSTRAINT "FK_b809eaf034d24047e31fdd11c94"`,
        );
        await queryRunner.query(`DROP TABLE "tellos_construction_site"`);
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_construction_site_status_enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "tellos"."tellos_construction_site_type_enum"`,
        );
    }
}
