
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { QualificationNameService } from '../service/qualification-name.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { QualificationNameFilterArgInput } from '../dto/args/qualification-name.filter.arg.input';
import { QualificationNameColumnToDisplayBodInput } from '../dto/args/qualification-name.column.to.display.bod.input';

@Controller('qualification-name')
export class QualificationNameController {

    public constructor(
        private readonly _service: QualificationNameService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: QualificationNameColumnToDisplayBodInput,
        @Body() filter?: QualificationNameFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((qualname) => {
            return {
                denomination: qualname.name, validity: qualname.validity,
                DENOM: column.denomination_c ? true : false,
                VALIDITY: column.validity_c ? true : false
            };
        })

        return res.render(
            'pdf/qualification-name/qualification-name-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'qualification-name/qualification-name_export.pdf')
                res.send(html);
            }
        );
    }

}
