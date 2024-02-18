
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessTenderTypeService } from '../service/business-tender-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessTenderTypeFilterArgInput } from '../dto/args/business-tender-type.filter.arg.input';
import { BusinessTenderTypeColumnToDisplayBodInput } from '../dto/args/business-tender-type.column.to.display.bod.input';

@Controller('business-tender-type')
export class BusinessTenderTypeController {

    public constructor(
        private readonly _service: BusinessTenderTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessTenderTypeColumnToDisplayBodInput,
        @Body() filter?: BusinessTenderTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-tender-type/business-tender-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-tender-type/business-tender-type_export.pdf')
                res.send(html);
            }
        );
    }

}
