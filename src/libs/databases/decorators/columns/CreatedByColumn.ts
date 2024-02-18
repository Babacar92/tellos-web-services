import { getCurrentUser } from "src/libs/databases/utils/db.utils";
import { ColumnOptions, getMetadataArgsStorage } from "typeorm";

/**
 * Created by connected user column
 * @param options 
 * @returns 
 */
export const CreatedByColumn = (options?: ColumnOptions): PropertyDecorator => {
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
                update: false,
                transformer: {
                    from(value?: string): string | undefined {
                        return value;
                    },
                    to(value?: string): string | undefined {
                        const currentUser = getCurrentUser();
                        return value || currentUser?.username || currentUser?.email;
                    },
                },
            }, options),
        });
    };
}