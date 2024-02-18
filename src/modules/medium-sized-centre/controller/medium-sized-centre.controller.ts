
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { MediumSizedCentreService } from '../service/medium-sized-centre.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { MediumSizedCentreFilterArgInput } from '../dto/args/medium-sized-centre.filter.arg.input';
import { MediumSizedCentreColumnToDisplayBodInput } from '../dto/args/medium-sized-centre.column.to.display.bod.input';

@Controller('medium-sized-centre')
export class MediumSizedCentreController {

    public constructor(
        private readonly _service: MediumSizedCentreService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: MediumSizedCentreColumnToDisplayBodInput,
        @Body() filter?: MediumSizedCentreFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((msc) => {
            return {
                label: msc.label, code: msc.code,
                LABEL: column.label_c ? true : false, CODE: column.code_c ? true : false
            };
        })

        return res.render(
            'pdf/medium-sized-centre/medium-sized-centre-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'medium-sized-centre/medium-sized-centre_export.pdf')
                res.send(html);
            }
        );
    }

}
