import { EntityManager, Repository } from 'typeorm';

export abstract class AbstractRepositoryService {
    /**
     * Set transaction manager action
     * @param callback
     * @param repositoryOrTransaction
     */
    public async useTransaction(
        callback: (transactionManager: EntityManager) => Promise<any>,
        repositoryOrTransaction?: string | EntityManager,
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!(repositoryOrTransaction instanceof EntityManager)) {
                const repo = this.getRepo(<any>repositoryOrTransaction);

                if (!(repo instanceof Repository)) {
                    resolve(null);
                    return;
                }

                const queryRunner = repo.manager.connection.createQueryRunner();

                // Start transaction
                await queryRunner.startTransaction();

                // set result
                let error: boolean = false,
                    result: any;

                try {
                    // Run user callback
                    result = await callback(queryRunner.manager);

                    // Commit Transaction
                    await queryRunner.commitTransaction();
                } catch (e) {
                    // Rollback Transaction
                    await queryRunner.rollbackTransaction();

                    // Set error
                    error = true;

                    // Reject queries
                    reject(e);
                } finally {
                    // Release the query runner
                    await queryRunner.release();

                    // Return result
                    if (!error) resolve(await result);
                    else resolve(null);
                }
            } else {
                const queryRunner = repositoryOrTransaction.queryRunner;

                let error: boolean = false;

                try {
                    // Run user callback
                    const result = await callback(
                        queryRunner?.manager || repositoryOrTransaction,
                    );

                    // Return result
                    resolve(await result);
                } catch (e) {
                    // Rollback Transaction
                    if (queryRunner && queryRunner.isTransactionActive) {
                        await queryRunner.rollbackTransaction();
                    }

                    // Set error
                    error = true;

                    // Reject queries
                    reject(e);
                } finally {
                    if (error) {
                        // Release the query runner
                        await queryRunner.release();
                    }
                }
            }
        });
    }

    /**
     * Return the repository
     * @param repo
     */
    public abstract getRepo(repo?: string): Repository<any>;
}
