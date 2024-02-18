import { Brackets, ObjectLiteral } from "typeorm";
import { DeleteQueryBuilder } from "typeorm/query-builder/DeleteQueryBuilder";
import { EncryptionSearchMatchType } from "../../services/encryption.service";
import { DatabaseSortArg } from "../args/database.sort.arg";
import { encryptionAndWhereCrypt, encryptionOrWhereCrypt, encryptionWhereCrypt, sortResult } from "./methods.qb.database.init";


/**
 * Declare methods to DeleteQueryBuilder
 */
declare module "typeorm/query-builder/DeleteQueryBuilder" {
    interface DeleteQueryBuilder<Entity> {

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        whereCrypt(
            this: DeleteQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): DeleteQueryBuilder<Entity>;

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        andWhereCrypt(
            this: DeleteQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): DeleteQueryBuilder<Entity>;

        /**
         * Add condition or where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        orWhereCrypt(
            this: DeleteQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): DeleteQueryBuilder<Entity>;

        /**
         * Add sort to query
         * @param this 
         * @param sort 
         */
        sortResult(
            this: DeleteQueryBuilder<Entity>,
            sort: DatabaseSortArg,
            cb?: (columnName: string) => string | undefined
        ): DeleteQueryBuilder<Entity>;
    }
}

/**
 * Add methods to DeleteQueryBuilder
 */
DeleteQueryBuilder.prototype.whereCrypt = function <Entity>(
    this: DeleteQueryBuilder<Entity>,
    where: string | Brackets | ((qb: DeleteQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): DeleteQueryBuilder<Entity> {
    return encryptionWhereCrypt(this, where, parameters, searchMatch);
}

DeleteQueryBuilder.prototype.andWhereCrypt = function <Entity>(
    this: DeleteQueryBuilder<Entity>,
    where: string | Brackets | ((qb: DeleteQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): DeleteQueryBuilder<Entity> {
    return encryptionAndWhereCrypt(this, where, parameters, searchMatch);
}

DeleteQueryBuilder.prototype.orWhereCrypt = function <Entity>(
    this: DeleteQueryBuilder<Entity>,
    where: string | Brackets | ((qb: DeleteQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): DeleteQueryBuilder<Entity> {
    return encryptionOrWhereCrypt(this, where, parameters, searchMatch);
}

DeleteQueryBuilder.prototype.sortResult = function <Entity>(
    this: DeleteQueryBuilder<Entity>,
    sort: DatabaseSortArg,
    cb?: (columnName: string) => string | undefined
): DeleteQueryBuilder<Entity> {
    return sortResult(this, sort, cb);
}
