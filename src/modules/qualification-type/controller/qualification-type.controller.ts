
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { QualificationTypeService } from '../service/qualification-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { QualificationTypeFilterArgInput } from '../dto/args/qualification-type.filter.arg.input';
import { QualificationTypeColumnToDisplayBodInput } from '../dto/args/qualification-type.column.to.display.bod.input';

@Controller('qualification-type')
export class QualificationTypeController {

    public constructor(
        private readonly _service: QualificationTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: QualificationTypeColumnToDisplayBodInput,
        @Body() filter?: QualificationTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((qualtype) => {
            return { denomination: qualtype.name, DENOM: column.denomination ? true : false };
        })

        return res.render(
            'pdf/qualification-type/qualification-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'qualification-type/qualification-type_export.pdf')
                res.send(html);
            }
        );
    }

}
