import { ColumnOptions, getMetadataArgsStorage } from "typeorm";
import { EncryptionService } from "../../services/encryption.service";

/**
 * The crypt column
 * 
 * On query builder, you can use this methods
 * 
 * Create in env the keys
 * 
 * Choice your algorithm
 * CRYPTO_ALGORITHM
 * 
 * For this key, set a string with length 32
 * CRYPTO_SECRET_KEY
 * 
 * @example
 * SelectQueryBuilder.whereCrypt(where, parameters, 'LIKE|EQUAL')
 * 
 * SelectQueryBuilder.andWhereCrypt(where, parameters, 'LIKE|EQUAL')
 * 
 * SelectQueryBuilder.orWhereCrypt(where, parameters, 'LIKE|EQUAL')
 * @param options
 * @returns
 */
export const CryptColumn = (options?: ColumnOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        const {
            uniques,
            columns,
        } = getMetadataArgsStorage();

        if (options?.unique) {
            uniques.push({
                target: object.constructor,
                columns: [propertyName],
            });
        }

        columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: 'regular',
            options: Object.assign(<ColumnOptions>{
                type: 'varchar',
                length: 255,
                update: true,
                comment: `Encryption value for field ${propertyName}`,
                transformer: {
                    from(value?: string): string | undefined {
                        return EncryptionService.decrypt(value);
                    },
                    to(value?: string): string | undefined {
                        return EncryptionService.encrypt(value);
                    },
                },
            }, options),
        });
    };
};
