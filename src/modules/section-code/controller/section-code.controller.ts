
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SectionCodeService } from '../service/section-code.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { SectionCodeFilterArgInput } from '../dto/args/section-code.filter.arg.input';
import { SectionCodeColumnToDisplayBodInput } from '../dto/args/section-code.column.to.display.bod.input';

@Controller('section-code')
export class SectionCodeController {

    public constructor(
        private readonly _service: SectionCodeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: SectionCodeColumnToDisplayBodInput,
        @Body() filter?: SectionCodeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            const account = sc.purchaseAccounts.map((pa) => {
                return pa.account;
            })
            return {
                code: sc.code, designation: sc.designation, stock: sc.inventoryChangeAccount, accounts: account,
                CODE: column.code_c ? true : false,
                DESIGNATION: column.designation_c ? true : false,
                PUA: column.purchaseAccount_c ? true : false,
                INC: column.inventoryChange_c ? true : false

            };
        })


        return res.render(
            'pdf/section-code/section-code-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'section-code/section_code_export.pdf')
                res.send(html);
            }
        );
    }

}
