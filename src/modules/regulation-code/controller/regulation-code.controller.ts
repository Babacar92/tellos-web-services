
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RegulationCodeService } from '../service/regulation-code.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { RegulationCodeFilterArgInput } from '../dto/args/regulation-code.filter.arg.input';
import { RegulationCodeColumnToDisplayBodInput } from '../dto/args/regulation-code.column.to.display.bod.input';

@Controller('regulation-code')
export class RegulationCodeController {

    public constructor(
        private readonly _service: RegulationCodeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: RegulationCodeColumnToDisplayBodInput,
        @Body() filter?: RegulationCodeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((rc) => {
            return {
                code: rc.code, title: rc.title, immediateDays: rc.immediateDays, specificity: rc.specificity === true ? "Oui" : "Non", paymentDays: rc.paymentDays, additionnalDays: rc.additionnalDays,
                CODE: column.code_c ? true : false,
                TITLE: column.title_c ? true : false,
                IMMD: column.immediateDays_c ? true : false,
                SPECIFICITY: column.specificity_c ? true : false,
                PAYD: column.paymentDays_c ? true : false,
                ADDD: column.additionnalDays_c ? true : false
            };
        })


        return res.render(
            'pdf/regulation-code/regulation-code-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'regulation-code/regulation-code_export.pdf')
                res.send(html);
            }
        );
    }

}
