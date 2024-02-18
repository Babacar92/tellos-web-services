
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContractTypeEntryService } from '../service/contract-type-entry.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ContractTypeEntryFilterArgInput } from '../dto/args/contract-type-entry.filter.arg.input';
import { ContractTypeEntryColumnToDisplayBodInput } from '../dto/args/contract-type-entry.column.to.display.bod.input';

@Controller('contract-type-entry')
export class ContractTypeEntryController {

    public constructor(
        private readonly _service: ContractTypeEntryService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: ContractTypeEntryColumnToDisplayBodInput,
        @Body() filter?: ContractTypeEntryFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                id: sc.id, title: sc.title,
                ID: column.id_c ? true : false, TITLE: column.title_c ? true : false
            };
        })

        return res.render(
            'pdf/contract-type-entry/contract-type-entry-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'contract-type-entry/contract-type-entry_export.pdf')
                res.send(html);
            }
        );
    }

}
