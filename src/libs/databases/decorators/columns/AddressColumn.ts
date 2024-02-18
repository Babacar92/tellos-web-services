import { Country } from "country-state-city";
import { ColumnOptions, getMetadataArgsStorage } from "typeorm";

/**
 * The address column value type
 */
export declare type AddressColumntValueType = {
    street?: string,
    number?: string,
    postcode?: string,
    city?: string,
    country?: string,
};

/**
 * Address Column
 * Handle an address column in object
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
export const AddressColumn = (options?: ColumnOptions): PropertyDecorator => {
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
                    from(value?: string): AddressColumntValueType | undefined {
                        if (value) {
                            const address: AddressColumntValueType = JSON.parse(value
                                .replace('ADDRESS(', '')
                                .replace(/\)$/, ''));

                            address.country = Country.getCountryByCode(address.country)?.name;

                            return address;
                        }
                        return;
                    },
                    to(value?: AddressColumntValueType): string | undefined {
                        return value ? `ADDRESS(${JSON.stringify(value)})` : undefined;
                    },
                },
            }, options),
        });
    }
};