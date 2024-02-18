import { Command } from '../libs/bin/console/decorators/command.decorator';
import { AbstractCommand } from '../libs/bin/console/dto/abstract/abstract.command';
import { CommandArgsInterface } from '../libs/bin/console/dto/interface/command.args.interface';
import { COMMAND_REPONSE_CODE } from '../libs/bin/console/dto/enum/command.response.code.enum';
import { Input } from '../libs/bin/console/dto/terminal/terminal.input';
import { Output } from '../libs/bin/console/dto/terminal/terminal.output';
import { LoginService } from '../modules/login/service/login.service';
import * as dotenv from 'dotenv';
import { dump } from '../utils/utils';

dotenv.config();

const {
  USER_DEV_EMAIL,
  USER_DEV_USERNAME,
  USER_DEV_PASSWORD,
  USER_OWNER_EMAIL,
  USER_OWNER_USERNAME,
  USER_OWNER_PASSWORD,
} = process.env;

@Command({ name: 'add:default:users' })
export class AddDefaultUsersCommand extends AbstractCommand {
  public name = 'add:default:users';

  public description = 'Adds the users specified in the environment file';

  public constructor(private readonly _loginService: LoginService) {
    super();
  }

  public async execute(
    input: Input,
    output: Output,
  ): Promise<COMMAND_REPONSE_CODE> {
    if (USER_DEV_USERNAME || USER_DEV_EMAIL) {
      const userDevExist = await this._loginService.existByColumn(
        USER_DEV_USERNAME,
        'username',
      );

      if (!userDevExist) {
        await this._loginService.create({
          email: USER_DEV_EMAIL,
          username: USER_DEV_USERNAME,
          password: USER_DEV_PASSWORD,
          active: true,
        });

        output.success('The user admin {dev} added', {
          dev: USER_DEV_USERNAME,
        });
      }
    }

    if (USER_OWNER_EMAIL || USER_OWNER_USERNAME) {
      const userAdminExist = await this._loginService.existByColumn(
        USER_OWNER_USERNAME,
        'username',
      );

      if (!userAdminExist) {
        await this._loginService.create({
          email: USER_OWNER_EMAIL,
          username: USER_OWNER_USERNAME,
          password: USER_OWNER_PASSWORD,
          active: true,
        });

        output.success('The user admin {admin} added', {
          admin: USER_OWNER_USERNAME,
        });
      }
    }

    return undefined;
  }

  public init(args: CommandArgsInterface): Promise<void> | void {
    return undefined;
  }
}
