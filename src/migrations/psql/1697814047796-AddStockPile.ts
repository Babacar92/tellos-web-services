import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class AddStockPile1697814047796 implements MigrationInterface {
    name = 'AddStockPile1697814047796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tellos_stock_pile" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), "id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "entity_id" integer NOT NULL, CONSTRAINT "UQ_1ddca6bdc8d6e1b1499fbb21507" UNIQUE ("code"), CONSTRAINT "PK_2b4ee3979947bcb0e8fa28376c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tellos_stock_pile" ADD CONSTRAINT "FK_ddaed03c2f3a5fa063bd34a81af" FOREIGN KEY ("entity_id") REFERENCES "tellos_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tellos_stock_pile" DROP CONSTRAINT "FK_ddaed03c2f3a5fa063bd34a81af"`);
        await queryRunner.query(`DROP TABLE "tellos_stock_pile"`);
    }

}
