
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContractApprenticeService } from '../service/contract-apprentice.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ContractApprenticeFilterArgInput } from '../dto/args/contract-apprentice.filter.arg.input';
import { ContractApprenticeColumnToDisplayBodInput } from '../dto/args/contract-apprentice.column.to.display.bod.input';

@Controller('contract-apprentice')
export class ContractApprenticeController {

    public constructor(
        private readonly _service: ContractApprenticeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfApprentice(
        @Res() res: Response,
        @Body() column: ContractApprenticeColumnToDisplayBodInput,
        @Body() filter?: ContractApprenticeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((ac) => {
            return {
                id: ac.id, title: ac.title,
                ID: column.id_c ? true : false, TITLE: column.title_c ? true : false
            };
        })

        return res.render(
            'pdf/contract-apprentice/contract-apprentice-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'contract-apprentice/contract-apprentice_export.pdf')
                res.send(html);
            }
        );
    }

}
