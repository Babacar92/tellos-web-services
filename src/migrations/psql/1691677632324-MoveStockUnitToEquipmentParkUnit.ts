import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class MoveStockUnitToEquipmentParkUnit1691677632324 implements MigrationInterface {
    name = 'MoveStockUnitToEquipmentParkUnit1691677632324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tellos_stock_unit"`);
        await queryRunner.query(`CREATE TABLE "tellos_equipment_park_unit" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_48dae7eccf7386483deb6c18524" UNIQUE ("title", "deleted_at"), CONSTRAINT "PK_8d499a223a804e3f24c97a24e0d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tellos_equipment_park_unit"`);
        await queryRunner.query(`CREATE TABLE "tellos_stock_unit" ("id" SERIAL NOT NULL, "title" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" character varying(255), "updated_by" character varying(255), CONSTRAINT "UQ_e69defb3acf1a0d490c7bb15c4f" UNIQUE ("title", "deleted_at"), CONSTRAINT "PK_51f47dc93de4659b5b6c3890005" PRIMARY KEY ("id"))`);
    }

}
