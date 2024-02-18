import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsOptional, ValidateBy } from "class-validator";

/**
 * The schedule Decorators
 * @returns 
 */
export const ScheduleValidate = (): PropertyDecorator => applyDecorators(
    IsOptional(),
    Transform(({ value }) => {
        value.from = new Date(value.from);
        value.to = new Date(value.to);
        return value;
    }),
    ValidateBy({
        name: '',
        validator: {
            validate: (value: any, validationArguments?: any) => value && !isNaN(value.from) && !isNaN(value.to),
            defaultMessage: (validationArguments?: any) => 'Is invalid schedule',
        }
    })
);