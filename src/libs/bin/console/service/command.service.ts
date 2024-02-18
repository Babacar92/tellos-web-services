import { INestApplication } from "@nestjs/common";
import { CommandItem } from "../decorators/command.decorator";
import { AbstractCommand } from "../dto/abstract/abstract.command";
import { CommandArgs } from "../dto/arg/command.args";
import { Input } from "../dto/terminal/terminal.input";
import { Output } from "../dto/terminal/terminal.output";
import { COMMAND_REPONSE_CODE } from "../dto/enum/command.response.code.enum";
import * as chalk from 'chalk';
import { Type } from '@nestjs/common';
import { COMMAND_TABLE_CHARS_BORDER_MODEL_NAME } from "../dto/enum/command.table.chars.model.name.enum";

/**
 * The command service
 */
export class CommandService {

    private static _instance: CommandService;

    /**
     * The constructor
     * @param app 
     * @param commands 
     */
    public constructor(
        private readonly app: INestApplication,
        private readonly commands: CommandItem[],
        private processArgs: string[],
    ) {
        if (!CommandService._instance) CommandService._instance = this;
    }

    /**
     * Set the new args
     * @param processArgs 
     * @returns 
     */
    public setProcessArgs(processArgs: string[]): CommandService {
        if (this.processArgs !== processArgs) this.processArgs = processArgs;

        return this;
    }

    /**
     * Return an service if exist
     * @param typeOrToken 
     * @param options 
     * @returns 
     */
    public async get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | Function | string | symbol): Promise<TResult> {
        try {
            return await this.app.resolve(typeOrToken);
        } catch (e) { }

        return undefined;
    }

    /**
     * Return command if found
     * @param command 
     * @returns 
     */
    public async getCommand(command: string): Promise<AbstractCommand> {
        try {
            const found = this.commands.find(c => c.name === command);
            const instance = await this.app.resolve(found?.class);
            return instance instanceof AbstractCommand ? instance : undefined;
        } catch (e) { }

        return undefined;
    }

    /**
     * Execute current command
     * @param command 
     */
    public async execute(command: AbstractCommand): Promise<void> {
        try {
            // Get Arg controle
            const argControl = new CommandArgs(
                new Input(),
                new Output(),
                this.processArgs,
            );

            // Check if add arg
            command.init(argControl);

            if (argControl.isRequireHelp()) {
                argControl.output.table([
                    [
                        argControl.output.color('Module', 'warning'),
                        await this._findModule(command.constructor),
                    ],
                    [
                        argControl.output.color('Class', 'warning'),
                        command.constructor.name,
                    ],
                    [
                        argControl.output.color('Name', 'warning'),
                        command.name,
                    ],
                    [
                        argControl.output.color('Argument(s)', 'warning'),
                        argControl.output
                            .generatedTable(
                                argControl.getArgs()
                                    .map(a => [
                                        (a.required ? '' : '?') + a.name,
                                        a.type,
                                        a.required
                                            ? 'required'
                                            : 'optional'
                                    ]),
                                null,
                                {
                                    borderModel: COMMAND_TABLE_CHARS_BORDER_MODEL_NAME.BORDER_HIDDEN,
                                    style: {
                                        'padding-left': 0,
                                        'padding-right': 0,
                                    }
                                }
                            ).toString(),
                    ],
                    [
                        argControl.output.color('Description', 'warning'),
                        command.description || '',
                    ],
                    [
                        argControl.output.color('Execution', 'warning'),
                        `node dist/src/bin/console ${command.name}`,
                    ],
                ], null, {
                    stringLineLength: 400,
                });

                process.exit(COMMAND_REPONSE_CODE.SUCCESS);
            } else {
                // Share args to input
                argControl.shareArgsToInput(command.name);

                // Run command
                const result = await command.execute(argControl.input, argControl.output);

                // Exit process with result
                process.exit(result);
            }
        } catch (e) {
            console.log(`[ERROR]:`, chalk.red(e.message));
            process.exit(COMMAND_REPONSE_CODE.ERROR);
        }
    }

    /**
     * Return the instance
     * @returns 
     */
    public static instance(): CommandService {
        return CommandService._instance;
    }

    /**
     * Return the module of command Class
     * @param commandClass 
     * @returns 
     */
    private _findModule(commandClass: Function): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const modules: any[] = Array.from((<any>this.app).container.modules.values());
            const module = modules
                .find(m => m._providers.get(commandClass) || m._providers.get(commandClass.name));

            resolve(module?._metatype?.name);
        });
    }

}