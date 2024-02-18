import { buildMessage, registerDecorator, ValidationOptions } from "class-validator";
import { ScheduleColumnDaysValueType } from "../columns/ScheduleColumn";

/**
 * The options for to check Password
 */
export declare type ScheduleValidationOptions = {
    maxValidite?: number,
};

/**
 * Validate a schedule
 * @returns
 */
export const ScheduleValidate = (options?: ScheduleValidationOptions, validationsOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        // Add min lenght for password

        let {
            maxValidite,
        } = options || {};

        maxValidite = maxValidite || 1;

        registerDecorator({
            name: 'SCHEDULE_VALIDATOR',
            target: object.constructor,
            propertyName: propertyName,
            options: validationsOptions,
            constraints: [],
            validator: {
                validate: (value: ScheduleColumnDaysValueType | undefined, args) => {
                    if (maxValidite < 1) return false;

                    value = value || <ScheduleColumnDaysValueType>{};

                    const countValidite = Object
                        .keys(value)
                        .filter(dayName => !!(value[dayName].from && value[dayName].to))

                    return countValidite.length >= maxValidite;
                },
                defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is not a valid schedule', validationsOptions),
            },
        });
    };
};