import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from '../service/login.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { LoginFilterArgInput } from '../dto/args/login.filter.arg.input';
import { ActionLogFilterArg } from 'src/modules/action-log/dto/args/action-log.filter.arg';
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import { ActionLogService } from 'src/modules/action-log/services/action-log.service';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { LoginColumnToDisplayBodInput } from '../dto/args/login.column.to.display.bod.input';
import { actionPageMap } from '../dto/types/action-page-map';
import { actionLabelMap } from '../dto/types/action-page-label-map';

@Controller('login')
export class LoginController {
  public constructor(
    private readonly _service: LoginService,
    private readonly _actionLogService: ActionLogService,
    private readonly _htmlToPdfService: HtmlToPdfService,
  ) {}

  private _formatDate(date: Date) {
    return (
      date &&
      date.getDate() +
        '/' +
        date.getMonth() +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes()
    );
  }

  @Post('/pdf/export')
  public async exportPdfLogin(
    @Res() res: Response,
    @Body() column: LoginColumnToDisplayBodInput,
    @Body() filter?: LoginFilterArgInput,
  ) {
    const datas = await this._service.findAll(filter);
    const datasToDisplay = datas.map((usr) => {
      return {
        username: usr.username,
        firstname: usr.employee.firstname,
        lastname: usr.employee.lastname,
        emailPro: usr.employee.emailPro,
        USRNAME: !column.username_c,
        FNAME: !column.firstname_c,
        LNAME: !column.lastname_c,
        EMAILP: !column.emailPro_c,
      };
    });

    return res.render(
      'pdf/login/login-export.hbs',
      { message: datasToDisplay, header: column },

      async (err, html) => {
        // Here you have access to the generated HTML
        // const data = await this._htmlToPdfService.fromContent(html, 'login/login_export.pdf')
        res.send(html);
      },
    );
  }

  @Post('/pdf/logs/download')
  public async exportPdfUsersLogs(
    @Res() res: Response,
    @Body() column: LoginColumnToDisplayBodInput,
    @Body() filter?: ActionLogFilterArg,
    @Body() sort?: DatabaseSortArg,
  ) {
    const pagination = { page: null, limit: null };

    filter.LoginEntity = LoginEntity.name;

    const users: { [userId: number]: LoginEntity } = {};

    const datas = await this._actionLogService.findAll(
      filter,
      sort,
      pagination,
      async (a) => {
        a.user =
          users[a.user?.id] ||
          (await this._service.findUserForActionLog(a.user));

        if (a.user?.id && !users[a.user.id]) users[a.user.id] = a.user;
      },
    );

    const datasToDisplay = datas.result.map((lg) => {
      const formatedDate = lg.createdAt && this._formatDate(lg.createdAt);

      const thePage = actionPageMap.get(lg.type)
        ? actionPageMap.get(lg.type)
        : null;
      const pageLabel = actionLabelMap.get(lg.type)
        ? actionLabelMap.get(lg.type)
        : null;

      return {
        createdAt: formatedDate,
        user: lg.user.email,
        page_n: thePage,
        action: pageLabel,

        // Columns
        DATE: !!column.createdAt_c,
        USER: !!column.user_c,
        PAGE: !!column.page_c,
        ACTION: !!column.action_c,
      };
    });

    return res.render(
      'pdf/users-logs/users-logs-export.hbs',
      { message: datasToDisplay, header: column },

      async (err, html) => {
        // Here you have access to the generated HTML
        // const data = await this._htmlToPdfService.fromContent(html, 'users-logs/users-logs_export.pdf')
        res.send(html);
      },
    );
  }
}
