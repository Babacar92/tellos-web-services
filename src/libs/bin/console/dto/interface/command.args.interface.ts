import { CommandArgConstraintInterface } from "./command.arg.constraint.interface";

/**
 * The type of arg item
 */
export type CommandArgType = 'string' | 'integer' | 'float' | 'json' | 'date' | 'time' | 'datetime' | 'boolean';

/**
 * The type of arg options
 */
export type CommandArgOptions = {
    require?: boolean,
    type?: CommandArgType,
    constraints?: CommandArgConstraintInterface[],
    transform?: (value: any) => any,
};

/**
 * Interface of argument
 */
export interface CommandArgsInterface {

    /**
     * The add argument of command
     * @param name 
     * @param options 
     */
    addArg(name: string, options?: CommandArgOptions, defaultValue?: any): CommandArgsInterface;

}