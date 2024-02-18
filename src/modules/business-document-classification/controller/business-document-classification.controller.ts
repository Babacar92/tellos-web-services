
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessDocumentClassificationService } from '../service/business-document-classification.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessDocumentClassificationFilterArgInput } from '../dto/args/business-document-classification.filter.arg.input';
import { BusinessDocumentClassificatonColumnToDisplayBodInput } from '../dto/args/business-document-classification.column.to.display.bod.input';

@Controller('business-document-classification')
export class BusinessDocumentClassificationController {

    public constructor(
        private readonly _service: BusinessDocumentClassificationService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessDocumentClassificatonColumnToDisplayBodInput,
        @Body() filter?: BusinessDocumentClassificationFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-document-classification/business-document-classification-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-document-classification/business-document-classification_export.pdf')
                res.send(html);
            }
        );
    }

}
