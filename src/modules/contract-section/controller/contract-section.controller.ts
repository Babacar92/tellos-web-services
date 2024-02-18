
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContractSectionService } from '../service/contract-section.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ContractSectionFilterArgInput } from '../dto/args/contract-section.filter.arg.input';
import { ContractSectionColumnToDisplayBodInput } from '../dto/args/contract-section.column.to.display.bod.input';

@Controller('contract-section')
export class ContractSectionController {

    public constructor(
        private readonly _service: ContractSectionService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: ContractSectionColumnToDisplayBodInput,
        @Body() filter?: ContractSectionFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                id: sc.id, title: sc.title,
                ID: column.id_c ? true : false, TITLE: column.title_c ? true : false
            };
        })


        return res.render(
            'pdf/contract-section/contract-section-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'contract-section/contract-section_export.pdf')
                res.send(html);
            }
        );
    }

}
