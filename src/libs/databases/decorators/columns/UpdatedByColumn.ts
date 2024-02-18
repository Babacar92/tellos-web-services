import { getCurrentUser } from "src/libs/databases/utils/db.utils";
import { dump } from "src/utils/utils";
import { ColumnOptions, getMetadataArgsStorage } from "typeorm";

/**
 * Updated by connected user column
 * @param options 
 * @returns 
 */
export const UpdatedByColumn = (options?: ColumnOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        const {
            columns,
        } = getMetadataArgsStorage();

        columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: 'regular',
            options: Object.assign(<ColumnOptions>{
                type: 'varchar',
                length: 255,
                nullable: true,
                update: true,
                transformer: {
                    from(value?: string): string | undefined {
                        return value;
                    },
                    to(value?: string): string | undefined {
                        const currentUser = getCurrentUser();

                        return currentUser?.username || currentUser?.email || value;
                    },
                },
            }, options),
        });
    };
}