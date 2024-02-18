import { ColumnOptions, getMetadataArgsStorage } from "typeorm";

/**
 * The schedule time of days
 */
export declare type ScheduleColumnDaysTimesValueType = {
    from: Date | string,
    to: Date | string,
};

/**
 * The schedule days
 */
export declare type ScheduleColumnDaysValueType = {
    monday: ScheduleColumnDaysTimesValueType[],
    tuesday: ScheduleColumnDaysTimesValueType[],
    wednesday: ScheduleColumnDaysTimesValueType[],
    thursday: ScheduleColumnDaysTimesValueType[],
    friday: ScheduleColumnDaysTimesValueType[],
    saturday: ScheduleColumnDaysTimesValueType[],
    sunday: ScheduleColumnDaysTimesValueType[],
};

/**
 * Schedule Column
 * Handle an schedule column in object
 * 
 * {
 *   street?: string,
 *   number?: string,
 *   postcode?: string,
 *   city?: string,
 *   country?: string,
 * }
 * @param options 
 * @returns 
 */
export const ScheduleColumn = (options?: ColumnOptions): PropertyDecorator => {
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
                type: 'longtext',
                update: true,
                transformer: {
                    from(value?: string): ScheduleColumnDaysValueType | undefined {
                        // Country.getCountryByCode(code)
                        if (value) {
                            const schedule: ScheduleColumnDaysValueType = JSON.parse(value
                                .replace('SCHEDULE(', '')
                                .replace(/\)$/, ''));

                            return schedule;
                        }
                        return;
                    },
                    to(value?: ScheduleColumnDaysValueType): string | undefined {
                        return value ? `SCHEDULE(${JSON.stringify(value)})` : undefined;
                    },
                },
            }, options),
        });
    }
};