import { CommandArgOptions, CommandArgsInterface } from "../interface/command.args.interface";
import { Input } from "../terminal/terminal.input";
import { Output } from "../terminal/terminal.output";
import { CommandArgItem } from "./command.arg.item";
import * as chalk from 'chalk';

/**
 * The command arg Class
 */
export class CommandArgs implements CommandArgsInterface {

    /**
     * Check if user require help
     */
    private readonly requireHelp: boolean;

    /**
     * List of argument
     */
    private readonly args: CommandArgItem[] = [];

    /**
     * The constructor
     * @param input 
     * @param output 
     */
    public constructor(
        public readonly input: Input,
        public readonly output: Output,
        private readonly processArgs: string[],
    ) {
        this.requireHelp = !!processArgs[0]?.match(/^(\-)?(h|help)$/i);

        if (this.requireHelp && this.processArgs.length > 1) {
            throw new Error(`When you ask for help, you can only put one argument`);
        }
    }

    public addArg(
        name: string,
        options?: CommandArgOptions,
        defaultValue?: any,
    ): CommandArgsInterface {
        if (!this.args.find(a => a.name.toLowerCase() === name.toLowerCase())) {
            if (options?.require && this.args.length) {
                const before = this.args[this.args.length - 1];
                if (!before.required) {
                    throw new Error(`The argument ${chalk.yellow(name)} cannot be required if the previous argument ${chalk.yellow(before.name)} is not required`);
                }
            }

            this.args.push(new CommandArgItem(
                name,
                this.processArgs[this.args.length] || defaultValue,
                this.requireHelp,
                options,
            ));
        } else {
            throw new Error(`The require argument ${chalk.yellow(name)} already exist`);
        }
        return this;
    }

    /**
     * Return all args
     * @returns 
     */
    public getArgs(): CommandArgItem[] {
        return this.args;
    }

    /**
     * Share the Arg to Input
     */
    public shareArgsToInput(command: string): void {
        if (!this.args.length && this.processArgs.length) {
            throw new Error(this.output.replaceParams(`The {command} command does not need an argument`, {
                command: this.output.color(command, 'warning'),
            }));
        } else if (this.args.length < this.processArgs.length) {
            throw new Error(this.output.replaceParams(`The command {command} needs {count} parameter(s)`, {
                command: this.output.color(command, 'warning'),
                count: this.output.color(this.args.length.toString(), 'warning'),
            }));
        }

        this.input.setArgs(this.args);
    }

    /**
     * Check if require help
     * @returns 
     */
    public isRequireHelp(): boolean {
        return this.requireHelp;
    }

}