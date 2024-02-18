import { buildMessage, registerDecorator, ValidationOptions } from "class-validator";
import { REMOVE_TYPES } from "src/libs/databases/dto/types/databases.type";
import { enumToArray } from "../../../../utils/utils";

/**
 * Validate a schedule
 * @returns
 */
export const RemoveTypeItemValidate = (validationsOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        // Add min lenght for password
        registerDecorator({
            name: 'SCHEDULE_VALIDATOR',
            target: object.constructor,
            propertyName: propertyName,
            options: validationsOptions,
            constraints: [],
            validator: {
                validate: (value: REMOVE_TYPES | undefined, args) => {
                    if(!enumToArray(REMOVE_TYPES).find(v => v === value)) return false;

                    return true;
                },
                defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is not a valid type of remove item', validationsOptions),
            },
        });
    };
};