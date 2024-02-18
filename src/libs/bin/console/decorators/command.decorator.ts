import * as dotenv from 'dotenv';

dotenv.config();

const {
    APP_ENV,
} = process.env;

export type CommandItem = { name: string, class: Function, hidden?: boolean, instance?: any };

export const COMMANDS: CommandItem[] = [];

/**
 * The Decorator of Command
 * @param options 
 * 
 * Your Class should look like this
 * 
 * @example 
 * // Example of Class
 * \@Command({ name: 'custom' })
 * export class CustomCommand extends AbstractCommand {
 *
 *  public name: string = "custom";
 *
 *  public description?: string;
 *
 *  public constructor() {
 *      super();
 *  }
 *
 *  public init(args: CommandArgsInterface): Promise<void> | void { }
 *
 *  public async execute(input: Input, output: Output): Promise<COMMAND_REPONSE_CODE> { }
 * }
 * @returns 
 */
export const Command = (options: {
    name: string,
    hidden?: boolean,
    onlyLocal?: boolean,
}): ClassDecorator => {
    return function (target: Function) {
        if (!COMMANDS.find(c => c.name === options.name) && (!options.onlyLocal || APP_ENV === 'local')) {
            COMMANDS.push({
                name: options.name,
                class: target,
                hidden: options.hidden,
            });
        }
    };
};