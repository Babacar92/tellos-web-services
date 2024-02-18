
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExpensePostService } from '../service/expense-post.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ExpensePostFilterArgInput } from '../dto/args/expense-post.filter.arg.input';
import { ExpensePostColumnToDisplayBodInput } from '../dto/args/expense-post.column.to.display.bod.input';

@Controller('expense-post')
export class ExpensePostController {

    public constructor(
        private readonly _service: ExpensePostService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: ExpensePostColumnToDisplayBodInput,
        @Body() filter?: ExpensePostFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((ep) => {
            return { denomination: ep.name, NAME: column.name_c ? true : false, };
        })


        return res.render(
            'pdf/expense-post/expense-post-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'expense-post/expense-post_export.pdf')
                res.send(html);
            }
        );
    }

}
