
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ParagraphFrameService } from '../services/paragraph-frame.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ParagraphFrameFilterArgInput } from '../dto/args/paragraph-frame.filter.arg.input';
import { ParagraphFrameColumnToDisplayBodInput } from '../dto/args/paragraph-frame.column.to.display.bod.input';

@Controller('paragraph-frame')
export class ParagraphFrameController {

    public constructor(
        private readonly _service: ParagraphFrameService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    private _formatDate(date: Date) {
        return date && date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    }


    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: ParagraphFrameColumnToDisplayBodInput,
        @Body() filter?: ParagraphFrameFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((pf) => {
            const formatedDate = pf.updatedAt && this._formatDate(pf.updatedAt);

            return {
                category: pf.category, title: pf.title, updatedAt: formatedDate, user: pf?.updatedBy,
                CATEGORY: column.category_c ? true : false, TITLE: column.title_c ? true : false,
                UPAT: column.updatedAt_c ? true : false, USER: column.user_c ? true : false
            };
        })

        return res.render(
            'pdf/paragraph-frame/paragraph-frame-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'paragraph-frame/section_code_export.pdf')
                res.send(html);
            }
        );
    }

}
