import { COMMANDS, Command } from "../decorators/command.decorator";
import { AbstractCommand } from "../dto/abstract/abstract.command";
import { COMMAND_REPONSE_CODE } from "../dto/enum/command.response.code.enum";
import { CommandArgsInterface } from "../dto/interface/command.args.interface";
import { Input } from "../dto/terminal/terminal.input";
import { Output } from "../dto/terminal/terminal.output";

@Command({ name: 'list' })
export class ListCommand extends AbstractCommand {

    public name: string = "list";

    public description?: string = `List all the commands of the project`;

    public constructor(

    ) {
        super();
    }

    public init(args: CommandArgsInterface): void | Promise<void> {

    }

    public async execute(input: Input, output: Output): Promise<COMMAND_REPONSE_CODE> {

        output.table(
            COMMANDS
                .filter(c => !c.hidden)
                .map(c => c.instance)
                .map(i => [
                    i.name || "",
                    i.description || "",
                    `node dist/src/bin/console ${i.name}`,
                ]),
            ['Name', 'Description', 'Execution'],
        );

        return COMMAND_REPONSE_CODE.SUCCESS;
    }

}