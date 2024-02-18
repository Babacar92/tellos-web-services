import { Brackets, ObjectLiteral } from "typeorm";
import { InsertQueryBuilder } from "typeorm/query-builder/InsertQueryBuilder";
import { EncryptionSearchMatchType } from "../../services/encryption.service";
import { DatabaseSortArg } from "../args/database.sort.arg";
import { encryptionAndWhereCrypt, encryptionOrWhereCrypt, encryptionWhereCrypt, sortResult } from "./methods.qb.database.init";

/**
 * Declare methods to InsertQueryBuilder
 */
declare module "typeorm/query-builder/InsertQueryBuilder" {
    interface InsertQueryBuilder<Entity> {

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        whereCrypt(
            this: InsertQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): InsertQueryBuilder<Entity>;

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        andWhereCrypt(
            this: InsertQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): InsertQueryBuilder<Entity>;

        /**
         * Add condition or where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        orWhereCrypt(
            this: InsertQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): InsertQueryBuilder<Entity>;

        /**
         * Add sort to query
         * @param this 
         * @param sort 
         */
        sortResult(
            this: InsertQueryBuilder<Entity>,
            sort: DatabaseSortArg,
            cb?: (columnName: string) => string | undefined
        ): InsertQueryBuilder<Entity>;
    }
}

/**
 * Add methods to InsertQueryBuilder
 */
InsertQueryBuilder.prototype.whereCrypt = function <Entity>(
    this: InsertQueryBuilder<Entity>,
    where: string | Brackets | ((qb: InsertQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): InsertQueryBuilder<Entity> {
    return encryptionWhereCrypt(this, where, parameters, searchMatch);
}

InsertQueryBuilder.prototype.andWhereCrypt = function <Entity>(
    this: InsertQueryBuilder<Entity>,
    where: string | Brackets | ((qb: InsertQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): InsertQueryBuilder<Entity> {
    return encryptionAndWhereCrypt(this, where, parameters, searchMatch);
}

InsertQueryBuilder.prototype.orWhereCrypt = function <Entity>(
    this: InsertQueryBuilder<Entity>,
    where: string | Brackets | ((qb: InsertQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): InsertQueryBuilder<Entity> {
    return encryptionOrWhereCrypt(this, where, parameters, searchMatch);
}

InsertQueryBuilder.prototype.sortResult = function <Entity>(
    this: InsertQueryBuilder<Entity>,
    sort: DatabaseSortArg,
    cb?: (columnName: string) => string | undefined
): InsertQueryBuilder<Entity> {
    return sortResult(this, sort, cb);
}
