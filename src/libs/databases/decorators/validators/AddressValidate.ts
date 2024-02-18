import { buildMessage, registerDecorator, ValidationOptions } from "class-validator";
import { AddressColumntValueType } from "../columns/AddressColumn";

/**
 * The options of address validate
 */
export declare type AddressValidateOptions = {
    /** Check the street value */
    checkStreet?: boolean | ((street?: string) => boolean),
    /** Check the number value */
    checkNumber?: boolean | ((number?: string) => boolean),
    /** Check the postcode value */
    checkPostcode?: boolean | ((postcode?: string) => boolean),
    /** Check the city value */
    checkCity?: boolean | ((city?: string) => boolean),
    /** Check the country value */
    checkCountry?: boolean | ((country?: string) => boolean),
};

/**
 * Validate a password
 * @returns
 */
export const AddressValidate = (options?: AddressValidateOptions, validationsOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        let {
            checkStreet,
            checkNumber,
            checkPostcode,
            checkCity,
            checkCountry,
        } = options || {};

        checkStreet = checkStreet || true;
        checkNumber = checkNumber || true;
        checkPostcode = checkPostcode || true;
        checkCity = checkCity || true;
        checkCountry = checkCountry || true;

        registerDecorator({
            name: 'ADDRESS_VALIDATOR',
            target: object.constructor,
            propertyName: propertyName,
            options: validationsOptions,
            constraints: [],
            validator: {
                validate: (value: AddressColumntValueType | undefined, args) => {
                    if (!value) return false;

                    const {
                        number,
                        postcode,
                        street,
                        city,
                        country
                    } = value;

                    if (checkStreet) {
                        if (typeof checkStreet === 'boolean') {
                            if (!street) return false;
                        } else {
                            if (!checkStreet(street)) return false;
                        }
                    } else if (checkNumber) {
                        if (typeof checkNumber === 'boolean') {
                            if (!number) return false;
                        } else {
                            if (!checkNumber(number)) return false;
                        }
                    } else if (checkPostcode) {
                        if (typeof checkPostcode === 'boolean') {
                            if (!postcode) return false;
                        } else {
                            if (!checkPostcode(postcode)) return false;
                        }
                    } else if (checkCity) {
                        if (typeof checkCity === 'boolean') {
                            if (!city) return false;
                        } else {
                            if (!checkCity(city)) return false;
                        }
                    } else if (checkCountry) {
                        if (typeof checkCountry === 'boolean') {
                            if (!country) return false;
                        } else {
                            if (!checkCountry(country)) return false;
                        }
                    }

                    return true;
                },
                defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is not a valid address', validationsOptions),
            },
        });
    };
};