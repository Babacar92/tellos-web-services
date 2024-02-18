import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddIdentifierToEntity1694790514107 implements MigrationInterface {
    name = 'AddIdentifierToEntity1694790514107';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_entity" ADD "identifier_number" character varying NOT NULL DEFAULT ''`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_entity" DROP COLUMN "identifier_number"`,
        );
    }
}
