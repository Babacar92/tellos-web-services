import { ColumnOptions, getMetadataArgsStorage } from "typeorm";
import { dump } from "../../../../utils/utils";
import { EncryptionService } from "../../services/encryption.service";


/**
 * The password column
 * @param optionsS
 * @returns
 */
export const PasswordColumn = (options?: ColumnOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        const {
            uniques,
            columns,
        } = getMetadataArgsStorage();

        uniques.push({
            target: object.constructor,
            columns: [propertyName],
        });

        columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: 'regular',
            options: Object.assign(<ColumnOptions>{
                type: 'varchar',
                length: 255,
                update: true,
                transformer: {
                    from(value?: string): string | undefined {
                        return value;
                    },
                    to(value?: string): string | undefined {
                        return EncryptionService.hash(value);
                    },
                },
            }, options),
        });
    };
}