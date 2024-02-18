import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionnalMigration } from '../../libs/databases/decorators/classes/TransactionnalMigration';

@TransactionnalMigration()
export class AddTypeIntoQualificationName1690890199170
  implements MigrationInterface
{
  name = 'AddTypeIntoQualificationName1690890199170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tellos_qualification_name" ADD "type_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_qualification_name" ADD CONSTRAINT "FK_be7b5f733b16b2bb90a7eaa5fc5" FOREIGN KEY ("type_id") REFERENCES "tellos_qualification_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tellos_qualification_name" DROP CONSTRAINT "FK_be7b5f733b16b2bb90a7eaa5fc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tellos_qualification_name" DROP COLUMN "type_id"`,
    );
  }
}
