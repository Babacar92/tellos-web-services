import { gen, repeatString } from "../../../../utils/utils";
import { MinArgConstraint } from "../constraints/MinArgConstraint";
import { Command } from "../decorators/command.decorator";
import { AbstractCommand } from "../dto/abstract/abstract.command";
import { COMMAND_REPONSE_CODE } from "../dto/enum/command.response.code.enum";
import { CommandArgsInterface } from "../dto/interface/command.args.interface";
import { Input } from "../dto/terminal/terminal.input";
import { Output } from "../dto/terminal/terminal.output";

@Command({ name: 'generate:password' })
export class GeneratePasswordCommand extends AbstractCommand {

    public name: string = 'generate:password';

    public description?: string = 'Generate a new password';

    public init(args: CommandArgsInterface): void | Promise<void> {
        args
            .addArg('length', {
                require: false,
                type: 'integer',
                constraints: [
                    new MinArgConstraint(6),
                ],
            })
            .addArg('upperChar', {
                require: false,
                type: 'boolean',
            })
            .addArg('lowerChar', {
                require: false,
                type: 'boolean',
            })
            .addArg('intChar', {
                require: false,
                type: 'boolean',
            })
            .addArg('specChar', {
                require: false,
                type: 'boolean',
            });
    }

    public execute(input: Input, output: Output): COMMAND_REPONSE_CODE | Promise<COMMAND_REPONSE_CODE> {
        let length = input.getArg('length', 16),
            upperChar = input.getArg('upperChar', true),
            lowerChar = input.getArg('lowerChar', true),
            intChar = input.getArg('intChar', true),
            specChar = input.getArg('specChar', true);

        const password = gen(length, upperChar, lowerChar, intChar, specChar);

        output.writeLine(repeatString("=", password.length + 12), null, 2);
        output.success(password, null, 2);
        output.write(repeatString("=", password.length + 12));

        return COMMAND_REPONSE_CODE.SUCCESS;
    }

}