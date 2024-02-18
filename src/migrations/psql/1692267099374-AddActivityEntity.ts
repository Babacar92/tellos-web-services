import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddActivityEntity1692267099374 implements MigrationInterface {
    name = 'AddActivityEntity1692267099374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_activity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_715d89a6710b7640dbdc3bd2bda" UNIQUE ("code", "deleted_at"), CONSTRAINT "PK_ebb214ad90d1fd4a9c97b7a7848" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tellos_activity"`);
    }

}
