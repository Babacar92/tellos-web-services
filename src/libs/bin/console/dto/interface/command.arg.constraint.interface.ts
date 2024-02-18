export interface CommandArgConstraintInterface {

    /**
     * The message of constraint
     * #### Parameters:
     *  - {arg}
     *  - {value}
     * #### Example
     *  - The value {value} of argument {arg} is not valid
     * 
     * You can also define public property settings for your constraint
     * @example
     * export class Myconstraint implements CommandArgConstraintInterface {
     * 
     *    public message: string = `The argument {arg} is not validate by the opposite value {constraintProperty}`;
     * 
     *    public constructor(
     *        public readonly constraintProperty: any,
     *    ) { }
     * 
     *    public validate(value: any): boolean {
     *
     *    }
     * 
     * }
    */
    message: string;

    /**
     * Validate the argument value
     * @param value 
     * @returns {boolean}
     */
    validate(value: any): boolean;

}