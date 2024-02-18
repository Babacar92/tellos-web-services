import { repeatString } from "../../../../utils/utils";
import { EncryptionService } from "../../../databases/services/encryption.service";
import { Command } from "../decorators/command.decorator";
import { AbstractCommand } from "../dto/abstract/abstract.command";
import { COMMAND_REPONSE_CODE } from "../dto/enum/command.response.code.enum";
import { CommandArgsInterface } from "../dto/interface/command.args.interface";
import { Input } from "../dto/terminal/terminal.input";
import { Output } from "../dto/terminal/terminal.output";

@Command({ name: 'decrypt' })
export class DecryptCommand extends AbstractCommand {

    public name: string = 'decrypt';

    public description?: string = 'Decrypts a given value';

    public init(args: CommandArgsInterface): void | Promise<void> {
        args.addArg('value');
    }

    public async execute(input: Input, output: Output): Promise<COMMAND_REPONSE_CODE> {
        let value = input.getArg('value');

        if (!value) value = await input.ask(`Enter a value`);

        if (value) {
            const encrypted = EncryptionService.decrypt(value);
            output.writeLine(repeatString("=", encrypted.length + 12), null, 2);
            output.success(encrypted, null, 2);
            output.write(repeatString("=", encrypted.length + 12));
        } else {
            output.writeLine(repeatString("=", 31), null, 2);
            output.warning('No value entered', null, 2);
            output.write(repeatString("=", 31));
            return COMMAND_REPONSE_CODE.ERROR;
        }

        return COMMAND_REPONSE_CODE.SUCCESS;
    }

}