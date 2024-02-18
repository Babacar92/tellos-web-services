import { Brackets, ObjectLiteral } from "typeorm";
import { RelationQueryBuilder } from "typeorm/query-builder/RelationQueryBuilder";
import { EncryptionSearchMatchType } from "../../services/encryption.service";
import { DatabaseSortArg } from "../args/database.sort.arg";
import { encryptionAndWhereCrypt, encryptionOrWhereCrypt, encryptionWhereCrypt, sortResult } from "./methods.qb.database.init";


/**
 * Declare methods to RelationQueryBuilder
 */
declare module "typeorm/query-builder/RelationQueryBuilder" {
    interface RelationQueryBuilder<Entity> {

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        whereCrypt(
            this: RelationQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): RelationQueryBuilder<Entity>;

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        andWhereCrypt(
            this: RelationQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): RelationQueryBuilder<Entity>;

        /**
         * Add condition or where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        orWhereCrypt(
            this: RelationQueryBuilder<Entity>,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): RelationQueryBuilder<Entity>;

        /**
         * Add sort to query
         * @param this 
         * @param sort 
         */
        sortResult(
            this: RelationQueryBuilder<Entity>,
            sort: DatabaseSortArg,
            cb?: (columnName: string) => string | undefined
        ): RelationQueryBuilder<Entity>;
    }
}

/**
 * Add methods to RelationQueryBuilder
 */
RelationQueryBuilder.prototype.whereCrypt = function <Entity>(
    this: RelationQueryBuilder<Entity>,
    where: string | Brackets | ((qb: RelationQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): RelationQueryBuilder<Entity> {
    return encryptionWhereCrypt(this, where, parameters, searchMatch);
}

RelationQueryBuilder.prototype.andWhereCrypt = function <Entity>(
    this: RelationQueryBuilder<Entity>,
    where: string | Brackets | ((qb: RelationQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): RelationQueryBuilder<Entity> {
    return encryptionAndWhereCrypt(this, where, parameters, searchMatch);
}

RelationQueryBuilder.prototype.orWhereCrypt = function <Entity>(
    this: RelationQueryBuilder<Entity>,
    where: string | Brackets | ((qb: RelationQueryBuilder<Entity>) => string) | ObjectLiteral | ObjectLiteral[],
    parameters?: ObjectLiteral,
    searchMatch: EncryptionSearchMatchType = "EQUAL",
): RelationQueryBuilder<Entity> {
    return encryptionOrWhereCrypt(this, where, parameters, searchMatch);
}

RelationQueryBuilder.prototype.sortResult = function <Entity>(
    this: RelationQueryBuilder<Entity>,
    sort: DatabaseSortArg,
    cb?: (columnName: string) => string | undefined
): RelationQueryBuilder<Entity> {
    return sortResult(this, sort, cb);
}
