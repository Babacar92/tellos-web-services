import { ColumnOptions, getMetadataArgsStorage } from "typeorm";
import { dump, removeAccent } from "../../../../utils/utils";

/**
 * Transform value to UPPERCASE with snack_case
 * @param options 
 * @returns 
 */
export const UpperSnackCaseColumn = (options?: ColumnOptions): PropertyDecorator => {
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
                transformer: {
                    from(value?: string): string | undefined {
                        return value;
                    },
                    to(value?: string): string | undefined {
                        return removeAccent(value)?.replace(/[ ]+/ig, '_').toUpperCase();
                    },
                },
            }, options),
        });
    };
}