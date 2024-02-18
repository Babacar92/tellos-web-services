
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessDocumentTypeService } from '../service/business-document-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessDocumentTypeFilterArgInput } from '../dto/args/business-document-type.filter.arg.input';
import { BusinessDocumentTypeColumnToDisplayBodInput } from '../dto/args/business-document-type.column.to.display.bod.input';

@Controller('business-document-type')
export class BusinessDocumentTypeController {

    public constructor(
        private readonly _service: BusinessDocumentTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessDocumentTypeColumnToDisplayBodInput,
        @Body() filter?: BusinessDocumentTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-document-type/business-document-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-document-type/business-document-type_export.pdf')
                res.send(html);
            }
        );
    }

}
