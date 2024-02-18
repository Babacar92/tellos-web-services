import { buildMessage, matches, minLength, registerDecorator, ValidationOptions } from "class-validator";

/**
 * The options for to check Password
 */
export declare type PasswordValidationOptions = {
    lowerCase?: boolean,
    upperCase?: boolean,
    numberChar?: boolean,
    specChar?: boolean,
    minChar?: number,
};

/**
 * Validate a password
 * @returns
 */
export const PasswordValidate = (options?: PasswordValidationOptions, validationsOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        const {
            lowerCase,
            upperCase,
            numberChar,
            specChar,
            minChar,
        } = (options || {});

        // Add lower case validation
        if ((lowerCase || true)) {
            registerDecorator({
                name: 'PASSWORD_LOWER_CASE_VALIDATOR',
                target: object.constructor,
                propertyName: propertyName,
                options: validationsOptions,
                constraints: [/[a-z]+/],
                validator: {
                    validate: (value, args) => matches(value, args.constraints[0], args.constraints[1]),
                    defaultMessage: buildMessage((eachPrefix, args) => eachPrefix + '$property must have a lower character', validationsOptions),
                },
            });
        }

        // Add upper case validation
        if ((upperCase || true)) {
            registerDecorator({
                name: 'PASSWORD_UPPER_CASE_VALIDATOR',
                target: object.constructor,
                propertyName: propertyName,
                options: validationsOptions,
                constraints: [/[A-Z]+/],
                validator: {
                    validate: (value, args) => matches(value, args.constraints[0], args.constraints[1]),
                    defaultMessage: buildMessage((eachPrefix, args) => eachPrefix + '$property must have a upper character', validationsOptions),
                },
            });
        }

        // Add number character validation
        if ((numberChar || true)) {
            registerDecorator({
                name: 'PASSWORD_NUMBER_CHAR_VALIDATOR',
                target: object.constructor,
                propertyName: propertyName,
                options: validationsOptions,
                constraints: [/[0-9]+/],
                validator: {
                    validate: (value, args) => matches(value, args.constraints[0], args.constraints[1]),
                    defaultMessage: buildMessage((eachPrefix, args) => eachPrefix + '$property must have a number character', validationsOptions),
                },
            });
        }

        // Add special character validation
        if ((specChar || true)) {
            registerDecorator({
                name: 'PASSWORD_SPEC_CHAR_VALIDATOR',
                target: object.constructor,
                propertyName: propertyName,
                options: validationsOptions,
                constraints: [/[\W]+/],
                validator: {
                    validate: (value, args) => matches(value, args.constraints[0], args.constraints[1]),
                    defaultMessage: buildMessage((eachPrefix, args) => eachPrefix + '$property must have a special character', validationsOptions),
                },
            });
        }

        // Add min lenght for password

        registerDecorator({
            name: 'PASSWORD_MIN_LENGTH_VALIDATOR',
            target: object.constructor,
            propertyName: propertyName,
            options: validationsOptions,
            constraints: [(minChar || 8)],
            validator: {
                validate: (value, args) => minLength(value, args.constraints[0]),
                defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be longer than or equal to $constraint1 characters', validationsOptions),
            },
        });
    };
};