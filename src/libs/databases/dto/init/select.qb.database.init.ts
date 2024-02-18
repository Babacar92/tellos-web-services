import { Brackets, ObjectLiteral } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { EncryptionSearchMatchType } from '../../services/encryption.service';
import { buildPaginationResult, getPaginationSkip } from '../../utils/db.utils';
import { DatabaseSortArg } from '../args/database.sort.arg';
import { PaginationArg } from '../args/pagination.arg';
import { ResultPaginationInterface } from '../interfaces/result.pagination.interface';
import {
    encryptionAndWhereCrypt,
    encryptionOrWhereCrypt,
    encryptionWhereCrypt,
    sortResult,
} from './methods.qb.database.init';

/**
 * Declare methods to SelectQueryBuilder
 */
declare module 'typeorm/query-builder/SelectQueryBuilder' {
    interface SelectQueryBuilder<Entity> {
        /**
         * Add condition and where and search crypt registered value
         * @param this
         * @param where
         * @param parameters
         * @param searchMatch
         */
        whereCrypt(
            this: SelectQueryBuilder<Entity>,
            where:
                | string
                | Brackets
                | ((qb: this) => string)
                | ObjectLiteral
                | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): SelectQueryBuilder<Entity>;

        /**
         * Add condition and where and search crypt registered value
         * @param this
         * @param where
         * @param parameters
         * @param searchMatch
         */
        andWhereCrypt(
            this: SelectQueryBuilder<Entity>,
            where:
                | string
                | Brackets
                | ((qb: this) => string)
                | ObjectLiteral
                | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): SelectQueryBuilder<Entity>;

        /**
         * Add condition or where and search crypt registered value
         * @param this
         * @param where
         * @param parameters
         * @param searchMatch
         */
        orWhereCrypt(
            this: SelectQueryBuilder<Entity>,
            where:
                | string
                | Brackets
                | ((qb: this) => string)
                | ObjectLiteral
                | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): SelectQueryBuilder<Entity>;

        /**
         * Add sort to query
         * @param this
         * @param sort
         */
        sortResult(
            this: SelectQueryBuilder<Entity>,
            sort: DatabaseSortArg,
            cb?: (columnName: string) => string | undefined,
        ): SelectQueryBuilder<Entity>;

        /**
         * Return data result with pagination
         * @param this
         * @param pagination
         */
        getManyAndPaginate(
            this: SelectQueryBuilder<Entity>,
            pagination: PaginationArg,
        ): Promise<{ result: Entity[]; pagination: ResultPaginationInterface }>;
    }
}

/**
 * Add methods to SelectQueryBuilder
 */
SelectQueryBuilder.prototype.whereCrypt = function <Entity>(
    this: SelectQueryBuilder<Entity>,
    where:
        | string
        | Brackets
        | ((qb: SelectQueryBuilder<Entity>) => string)
        | ObjectLiteral
        | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = 'EQUAL',
): SelectQueryBuilder<Entity> {
    return encryptionWhereCrypt(this, where, parameters, searchMatch);
};

SelectQueryBuilder.prototype.andWhereCrypt = function <Entity>(
    this: SelectQueryBuilder<Entity>,
    where:
        | string
        | Brackets
        | ((qb: SelectQueryBuilder<Entity>) => string)
        | ObjectLiteral
        | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = 'EQUAL',
): SelectQueryBuilder<Entity> {
    return encryptionAndWhereCrypt(this, where, parameters, searchMatch);
};

SelectQueryBuilder.prototype.orWhereCrypt = function <Entity>(
    this: SelectQueryBuilder<Entity>,
    where:
        | string
        | Brackets
        | ((qb: SelectQueryBuilder<Entity>) => string)
        | ObjectLiteral
        | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = 'EQUAL',
): SelectQueryBuilder<Entity> {
    return encryptionOrWhereCrypt(this, where, parameters, searchMatch);
};

SelectQueryBuilder.prototype.sortResult = function <Entity>(
    this: SelectQueryBuilder<Entity>,
    sort: DatabaseSortArg,
    cb?: (columnName: string) => string | undefined,
): SelectQueryBuilder<Entity> {
    return sortResult(this, sort, cb);
};

SelectQueryBuilder.prototype.getManyAndPaginate = async function <Entity>(
    this: SelectQueryBuilder<Entity>,
    pagination: PaginationArg,
): Promise<{ result: Entity[]; pagination: ResultPaginationInterface }> {
    return new Promise(async (resolve, reject) => {
        const [result, count] = await this.skip(getPaginationSkip(pagination))
            .take(pagination.limit ? pagination.limit : null)
            .getManyAndCount();

        resolve(buildPaginationResult(result, count, pagination));
    });
};
