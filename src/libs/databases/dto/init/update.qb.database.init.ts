import { Brackets, ObjectLiteral } from "typeorm";
import { UpdateQueryBuilder } from "typeorm/query-builder/UpdateQueryBuilder";
import { EncryptionSearchMatchType } from "../../services/encryption.service";
import { DatabaseSortArg } from "../args/database.sort.arg";
import { encryptionAndWhereCrypt, encryptionOrWhereCrypt, encryptionWhereCrypt, sortResult } from "./methods.qb.database.init";


/**
 * Declare methods to UpdateQueryBuilder
 */
declare module "typeorm/query-builder/UpdateQueryBuilder" {
    interface UpdateQueryBuilder<Entity> {

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        whereCrypt(
            this: UpdateQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): UpdateQueryBuilder<Entity>;

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        andWhereCrypt(
            this: UpdateQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): UpdateQueryBuilder<Entity>;

        /**
         * Add condition or where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        orWhereCrypt(
            this: UpdateQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): UpdateQueryBuilder<Entity>;

        /**
         * Add sort to query
         * @param this 
         * @param sort 
         */
        sortResult(
            this: UpdateQueryBuilder<Entity>,
            sort: DatabaseSortArg,
            cb?: (columnName: string) => string | undefined
        ): UpdateQueryBuilder<Entity>;
    }
}

/**
 * Add methods to UpdateQueryBuilder
 */
UpdateQueryBuilder.prototype.whereCrypt = function <Entity>(
    this: UpdateQueryBuilder<Entity>,
    where: string | Brackets | ((qb: UpdateQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): UpdateQueryBuilder<Entity> {
    return encryptionWhereCrypt(this, where, parameters, searchMatch);
}

UpdateQueryBuilder.prototype.andWhereCrypt = function <Entity>(
    this: UpdateQueryBuilder<Entity>,
    where: string | Brackets | ((qb: UpdateQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): UpdateQueryBuilder<Entity> {
    return encryptionAndWhereCrypt(this, where, parameters, searchMatch);
}

UpdateQueryBuilder.prototype.orWhereCrypt = function <Entity>(
    this: UpdateQueryBuilder<Entity>,
    where: string | Brackets | ((qb: UpdateQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): UpdateQueryBuilder<Entity> {
    return encryptionOrWhereCrypt(this, where, parameters, searchMatch);
}

UpdateQueryBuilder.prototype.sortResult = function <Entity>(
    this: UpdateQueryBuilder<Entity>,
    sort: DatabaseSortArg,
    cb?: (columnName: string) => string | undefined
): UpdateQueryBuilder<Entity> {
    return sortResult(this, sort, cb);
}
