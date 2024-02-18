import { Module } from "@nestjs/common";
import { ListCommand } from "./commands/ListCommand";
import { PasswordHashCommand } from "./commands/PasswordHashCommand";
import { EncryptCommand } from "./commands/EncryptCommand";
import { DecryptCommand } from "./commands/DecryptCommand";
import { GeneratePasswordCommand } from "./commands/GeneratePasswordCommand";

@Module({
    providers: [
        ListCommand,
        PasswordHashCommand,
        EncryptCommand,
        DecryptCommand,
        GeneratePasswordCommand,
    ],
})
export class ConsoleModule { }