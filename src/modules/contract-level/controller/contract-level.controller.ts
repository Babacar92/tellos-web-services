
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContractLevelService } from '../service/contract-level.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ContractLevelFilterArgInput } from '../dto/args/contract-level.filter.arg.input';
import { ContractLevelColumnToDisplayBodInput } from '../dto/args/contract-level.column.to.display.bod.input';

@Controller('contract-level')
export class ContractLevelController {

    public constructor(
        private readonly _service: ContractLevelService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: ContractLevelColumnToDisplayBodInput,
        @Body() filter?: ContractLevelFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((ac) => {
            return {
                id: ac.id, title: ac.title,
                ID: column.id_c ? true : false, TITLE: column.title_c ? true : false
            };
        })

        return res.render(
            'pdf/contract-level/contract-level-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'contract-level/contract-level_export.pdf')
                res.send(html);
            }
        );
    }

}
