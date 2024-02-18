
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { NotificationTypeService } from '../service/notification-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { NotificationTypeFilterArgInput } from '../dto/args/notification-type.filter.arg.input';
import { NotificationTypeColumnToDisplayBodInput } from '../dto/args/notification-type.column.to.display.bod.input';

@Controller('notification-type')
export class NotificationTypeController {

    public constructor(
        private readonly _service: NotificationTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: NotificationTypeColumnToDisplayBodInput,
        @Body() filter?: NotificationTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((notif) => {
            return {
                denomination: notif.title, icon: notif.icon,
                DENOM: column.denomination_c ? true : false, ICON: column.icon_c ? true : false
            };
        })


        return res.render(
            'pdf/notification-type/notification-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'notification-type/notification-type_export.pdf')
                res.send(html);
            }
        );
    }

}
