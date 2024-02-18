
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomerTimelineService } from '../service/customer-timeline.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { CustomerTimelineFilterArgInput } from '../dto/args/customer-timeline.filter.arg.input';
import { CustomerTimelineColumnToDisplayBodInput } from '../dto/args/customer-timeline.to.display.bod.input';

@Controller('customer-timeline')
export class CustomerTimelineController {

    public constructor(
        private readonly _service: CustomerTimelineService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    private _formatDate(date: Date) {
        return date && date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: CustomerTimelineColumnToDisplayBodInput,
        @Body() filter?: CustomerTimelineFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((tline) => {
            const formatedDate = tline.dateFrom && this._formatDate(tline.dateFrom);

            return {
                startDate: formatedDate, client: tline.customer.name, type: tline.type, title: tline.title,
                description: tline.comment, file: tline.file ? "Oui" : "Non", realise: tline.done === true ? "Oui" : "Non",
                // Columns to display
                SDATE: column.startDate_c ? true : false,
                CLIENT: column.client_c ? true : false,
                TYPE: column.type_c ? true : false,
                TITLE: column.title_c ? true : false,
                DESC: column.description_c ? true : false,
                FILE: column.file_c ? true : false,
                REALISE: column.realise_c ? true : false,
            };
        })

        return res.render(
            'pdf/customer-timeline/customer-timeline-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'customer-timeline/customer-timeline_export.pdf')
                res.send(html);
            }
        );
    }

}
