import { QueryRunner } from "typeorm";

/**
 * Decorator to add transaction on migrations
 * @example
 * \@TransactionnalMigration()
 * export class MyMigration  implements MigrationInterface {
 * 
 * }
 * @returns 
 */
export const TransactionnalMigration = (): ClassDecorator => {
    return function (target: Function) {
        const oldUp = <(queryRunner: QueryRunner) => Promise<void>>target.prototype.up;
        const oldDown = <(queryRunner: QueryRunner) => Promise<void>>target.prototype.down;

        target.prototype.up = async (queryRunner: QueryRunner) => {
            // Start transaction if not started
            if (!queryRunner.isTransactionActive) {
                await queryRunner.startTransaction();
            }

            try {
                // Run original up
                await oldUp(queryRunner);

                // Commit Transaction
                if (queryRunner.isTransactionActive) {
                    await queryRunner.commitTransaction();
                }
            } catch (e) {
                // Rollback Transaction
                if (queryRunner.isTransactionActive) {
                    await queryRunner.rollbackTransaction();
                }

                throw new Error(e.message);
            } finally {
                // Rollback Transaction
                if (queryRunner.isTransactionActive) {
                    await queryRunner.release();
                }
            }
        };

        target.prototype.down = async (queryRunner: QueryRunner) => {
            // Start transaction if not started
            if (!queryRunner.isTransactionActive) {
                await queryRunner.startTransaction();
            }

            try {
                // Run original up
                await oldDown(queryRunner);

                // Commit Transaction
                if (queryRunner.isTransactionActive) {
                    await queryRunner.commitTransaction();
                }
            } catch (e) {
                // Rollback Transaction
                if (queryRunner.isTransactionActive) {
                    await queryRunner.rollbackTransaction();
                }

                throw new Error(e.message);
            } finally {
                // Rollback Transaction
                if (queryRunner.isTransactionActive) {
                    await queryRunner.release();
                }
            }
        };
    };
};