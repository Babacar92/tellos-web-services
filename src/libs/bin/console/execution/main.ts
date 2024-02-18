import { NestFactory } from '@nestjs/core';
import { COMMANDS } from '../decorators/command.decorator';
import { CommandService } from '../service/command.service';
import { AbstractCommand } from '../dto/abstract/abstract.command';
import { COMMAND_REPONSE_CODE } from '../dto/enum/command.response.code.enum';
import * as chalk from 'chalk';
import { ConsoleModule } from '../console.module';
import { isCommandExecution } from '../../../../utils/console.utils';
import { AppModule } from '../../../../app.module';

/**
 * Run the all registered commands
 * 
 * If you want to use this, add ConsoleModule in your AppModule
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
 * 
 * // Provide your Class by the module
 * \@Module({
 *   imports: [
 *      // Any import...
 *      ConsoleModule,
 *   ],
 *   providers: [
 *      // Any providers...
 *      CustomCommand,
 *   ],
 * })
 * export class AppModule { }
 */
export const runConsole = async () => {

    try {
        // Check if is run by src/bin/console
        if (!isCommandExecution()) {
            throw new Error('Is not a process of src/bin/console');
        }

        // Init application
        const app = await NestFactory.create(AppModule, {
            logger: false,
        });

        // Check if module is ready
        try {
            const module = await app.resolve(ConsoleModule);
        } catch (e) {
            console.log(chalk.red(`You need to import ${chalk.yellow('ConsoleModule')} in AppModule if you want to use console cli`));
            process.exit(COMMAND_REPONSE_CODE.ERROR);
        }

        // Init service
        const service = new CommandService(app, COMMANDS, process.argv.filter((v, k) => k > 2));

        // Found command
        const command: AbstractCommand = await service.getCommand(process.argv[2] || 'list');

        if (command) {
            // Execute command
            await service.execute(command);
        } else {
            // Write error command not found
            console.log(chalk.white(`[WARNING]: The command {command} doesn't found !`.replace('{command}', chalk.yellow(`"${process.argv[2] || ''}"`))));

            // Exit process
            process.exit(COMMAND_REPONSE_CODE.ERROR);
        }
    } catch (e) {
        console.error(e);
        process.exit(COMMAND_REPONSE_CODE.ERROR);
    }
};
