import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddInseeCodeEntity1691765540524 implements MigrationInterface {
    name = 'AddInseeCodeEntity1691765540524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_insee_code" ("id" SERIAL NOT NULL, "code" character varying, "name" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_d54e593459b274382b8d968fcd6" UNIQUE ("code", "deleted_at"), CONSTRAINT "PK_d2dbd29ad30a2eafbcb427706f2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tellos_insee_code"`);
    }

}
