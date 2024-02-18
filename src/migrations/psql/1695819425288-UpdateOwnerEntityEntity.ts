import { TransactionnalMigration } from '@/libs/databases/decorators/classes/TransactionnalMigration';
import { MigrationInterface, QueryRunner } from 'typeorm';

@TransactionnalMigration()
export class UpdateOwnerEntityEntity1695819425288
    implements MigrationInterface
{
    name = 'UpdateOwnerEntityEntity1695819425288';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "address" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "address_bis" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "postcode" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "city" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "country" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "phone" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "siret" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" ADD "ape" character varying`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "ape"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "siret"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "phone"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "country"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "city"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "postcode"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "address_bis"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tellos_owner_entity" DROP COLUMN "address"`,
        );
    }
}
