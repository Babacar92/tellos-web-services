import { repeatString } from "../../../../utils/utils";
import { EncryptionService } from "../../../databases/services/encryption.service";
import { Command } from "../decorators/command.decorator";
import { AbstractCommand } from "../dto/abstract/abstract.command";
import { COMMAND_REPONSE_CODE } from "../dto/enum/command.response.code.enum";
import { CommandArgsInterface } from "../dto/interface/command.args.interface";
import { Input } from "../dto/terminal/terminal.input";
import { Output } from "../dto/terminal/terminal.output";

@Command({ name: 'password:hash' })
export class PasswordHashCommand extends AbstractCommand {

    public name: string = 'password:hash';

    public description?: string = `Allows you to hash a password`;

    public constructor() {
        super();
    }

    public init(args: CommandArgsInterface): void | Promise<void> {

    }

    public async execute(input: Input, output: Output): Promise<COMMAND_REPONSE_CODE> {
        const pwd = await input.secret(`Enter your password`);

        if (pwd) {
            if (pwd.length >= 3) {
                const hashed = EncryptionService.hash(pwd);
                output.writeLine(repeatString("=", hashed.length + 12), null, 2);
                output.success(hashed, null, 2);
                output.write(repeatString("=", hashed.length + 12));
            } else {
                output.writeLine(repeatString("=", 55), null, 2);
                output.error('Have at least 3 characters for your password', null, 2);
                output.write(repeatString("=", 55));
                return COMMAND_REPONSE_CODE.ERROR;
            }
        } else {
            output.writeLine(repeatString("=", 31), null, 2);
            output.warning('No password entered', null, 2);
            output.write(repeatString("=", 31));
            return COMMAND_REPONSE_CODE.ERROR;
        }

        return COMMAND_REPONSE_CODE.SUCCESS;
    }

}