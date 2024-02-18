import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddWorkforceRateEntity1692348883525 implements MigrationInterface {
    name = 'AddWorkforceRateEntity1692348883525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_workforce_rate" ("id" SERIAL NOT NULL, "price" numeric(14,5), "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "entity_id" integer, "work_unit_id" integer, "section_code_id" integer, CONSTRAINT "UQ_ff4898f171ea603a48461ba4490" UNIQUE ("section_code_id", "entity_id", "deleted_at"), CONSTRAINT "PK_7fec89106d40c1718e265024a89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_workforce_rate" ADD CONSTRAINT "FK_131540dc048b6481a7c300e3b58" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_workforce_rate" ADD CONSTRAINT "FK_ee65980d0bf5636b99ff5827a89" FOREIGN KEY ("work_unit_id") REFERENCES "tellos_work_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tellos_workforce_rate" ADD CONSTRAINT "FK_2e4021c97e2e6377e7a1021c90b" FOREIGN KEY ("section_code_id") REFERENCES "tellos_section_code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_workforce_rate" DROP CONSTRAINT "FK_2e4021c97e2e6377e7a1021c90b"`);
        await queryRunner.query(`ALTER TABLE "tellos_workforce_rate" DROP CONSTRAINT "FK_ee65980d0bf5636b99ff5827a89"`);
        await queryRunner.query(`ALTER TABLE "tellos_workforce_rate" DROP CONSTRAINT "FK_131540dc048b6481a7c300e3b58"`);
        await queryRunner.query(`DROP TABLE "tellos_workforce_rate"`);
    }

}
