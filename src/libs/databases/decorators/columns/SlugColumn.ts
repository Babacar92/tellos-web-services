import { ColumnOptions, getMetadataArgsStorage } from "typeorm";
import { slug } from "../../../../utils/utils";

/**
 * Slug column
 * Transform value to Kebab Case
 * example My value => my-value
 * @param options 
 * @returns 
 */
export const SlugColumn = (options?: ColumnOptions): PropertyDecorator => {
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
                        return slug(value);
                    },
                },
            }, options),
        });
    }
};