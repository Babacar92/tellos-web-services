import { ColumnOptions, getMetadataArgsStorage } from "typeorm";

/**
 * Slug column
 * Transform value to Kebab Case
 * example My value => my-value
 * @param options 
 * @returns 
 */
export const TranslationColumn = (options?: ColumnOptions): PropertyDecorator => {
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
                comment: `Translation column ${propertyName}`,
                transformer: {
                    from(value?: string): string | undefined {
                        return value;
                    },
                    to(value?: string): string | undefined {
                        return value;
                    },
                },
            }, options),
        });
    }
};