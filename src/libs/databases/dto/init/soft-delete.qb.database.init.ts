import { Brackets, ObjectLiteral } from "typeorm";
import { SoftDeleteQueryBuilder } from "typeorm/query-builder/SoftDeleteQueryBuilder";
import { EncryptionSearchMatchType } from "../../services/encryption.service";
import { DatabaseSortArg } from "../args/database.sort.arg";
import { encryptionAndWhereCrypt, encryptionOrWhereCrypt, encryptionWhereCrypt, sortResult } from "./methods.qb.database.init";


/**
 * Declare methods to SoftDeleteQueryBuilder
 */
declare module "typeorm/query-builder/SoftDeleteQueryBuilder" {
    interface SoftDeleteQueryBuilder<Entity> {

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        whereCrypt(
            this: SoftDeleteQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): SoftDeleteQueryBuilder<Entity>;

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        andWhereCrypt(
            this: SoftDeleteQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): SoftDeleteQueryBuilder<Entity>;

        /**
         * Add condition or where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        orWhereCrypt(
            this: SoftDeleteQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): SoftDeleteQueryBuilder<Entity>;

        /**
         * Add sort to query
         * @param this 
         * @param sort 
         */
        sortResult(
            this: SoftDeleteQueryBuilder<Entity>,
            sort: DatabaseSortArg,
            cb?: (columnName: string) => string | undefined
        ): SoftDeleteQueryBuilder<Entity>;
    }
}

/**
 * Add methods to SoftDeleteQueryBuilder
 */
SoftDeleteQueryBuilder.prototype.whereCrypt = function <Entity>(
    this: SoftDeleteQueryBuilder<Entity>,
    where: string | Brackets | ((qb: SoftDeleteQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): SoftDeleteQueryBuilder<Entity> {
    return encryptionWhereCrypt(this, where, parameters, searchMatch);
}

SoftDeleteQueryBuilder.prototype.andWhereCrypt = function <Entity>(
    this: SoftDeleteQueryBuilder<Entity>,
    where: string | Brackets | ((qb: SoftDeleteQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): SoftDeleteQueryBuilder<Entity> {
    return encryptionAndWhereCrypt(this, where, parameters, searchMatch);
}

SoftDeleteQueryBuilder.prototype.orWhereCrypt = function <Entity>(
    this: SoftDeleteQueryBuilder<Entity>,
    where: string | Brackets | ((qb: SoftDeleteQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): SoftDeleteQueryBuilder<Entity> {
    return encryptionOrWhereCrypt(this, where, parameters, searchMatch);
}

SoftDeleteQueryBuilder.prototype.sortResult = function <Entity>(
    this: SoftDeleteQueryBuilder<Entity>,
    sort: DatabaseSortArg,
    cb?: (columnName: string) => string | undefined
): SoftDeleteQueryBuilder<Entity> {
    return sortResult(this, sort, cb);
}
