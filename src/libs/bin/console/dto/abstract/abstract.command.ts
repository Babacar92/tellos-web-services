import { COMMANDS } from "../../decorators/command.decorator";
import { COMMAND_REPONSE_CODE } from "../enum/command.response.code.enum";
import { CommandArgsInterface } from "../interface/command.args.interface";
import { Input } from "../terminal/terminal.input";
import { Output } from "../terminal/terminal.output";

/**
 * The Abstract Command for Class Command
 */
export abstract class AbstractCommand {

    /**
     * The name of command
     */
    public abstract name: string;

    /**
     * The description of command
     */
    public abstract description?: string;

    public constructor() {
        Promise
            .resolve()
            .then(() => {
                const found = COMMANDS.find(c => c.name === this.name);
                found.instance = this;
            });
    }

    /**
     * Init the arguments of command
     * @param args 
     */
    public abstract init(args: CommandArgsInterface): Promise<void> | void;

    /**
     * Execute the command
     * @param input 
     * @param output 
     * @returns
     */
    public abstract execute(input: Input, output: Output): Promise<COMMAND_REPONSE_CODE> | COMMAND_REPONSE_CODE;

}