import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller({
    path: 'mailer',
    host: [
        'localhost',
    ],
})
export class MailerController {

    public constructor(
    ) { }

    @Get('/example')
    public async example(
        @Req()
        req: Request,
        @Res()
        res: Response
    ) {
        return res.render('./mail/example.hbs', {
            title: 'My title example',
            body: 'My body example',
        });
    }
}
