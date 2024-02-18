import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { gen } from '../utils/utils';

@Controller('mailer/templates')
export class MailerTemplateController {

    /**
     * The constructor
     * @param _mailerService 
     */
    public constructor(
        private readonly _mailerService: MailerService,
    ) { }

    @Get('/recover-password')
    public async recoverPassword(
        @Res()
        res: Response,
    ) {
        return res.render("./mail/user/recover-password.hbs", {
            token: gen(8, true, false, true, false),
        });
    }
}
