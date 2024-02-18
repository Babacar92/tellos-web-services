import { Brackets, ObjectLiteral } from "typeorm";
import { EncryptionSearchMatchType } from "../../services/encryption.service";

/**
 * Declare methods to WhereExpressionBuilder
 */
declare module "typeorm/query-builder/WhereExpressionBuilder" {
    interface WhereExpressionBuilder {

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        whereCrypt(
            this: WhereExpressionBuilder,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): WhereExpressionBuilder;

        /**
         * Add condition and where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        andWhereCrypt(
            this: WhereExpressionBuilder,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): WhereExpressionBuilder;

        /**
         * Add condition or where and search crypt registered value
         * @param this 
         * @param where 
         * @param parameters 
         * @param searchMatch 
         */
        orWhereCrypt(
            this: WhereExpressionBuilder,
            where: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[],
            parameters?: ObjectLiteral,
            searchMatch?: EncryptionSearchMatchType,
        ): WhereExpressionBuilder;
    }
}
