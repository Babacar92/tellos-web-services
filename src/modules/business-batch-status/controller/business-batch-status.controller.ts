
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessBatchStatusService } from '../service/business-batch-status.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessBatchStatusFilterArgInput } from '../dto/args/business-batch-status.filter.arg.input';
import { BusinessBatchStatusColumnToDisplayBodInput } from '../dto/args/business-batch-status.column.to.display.bod.input';

@Controller('business-batch-status')
export class BusinessBatchStatusController {

    public constructor(
        private readonly _service: BusinessBatchStatusService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessBatchStatusColumnToDisplayBodInput,
        @Body() filter?: BusinessBatchStatusFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-batch-status/business-batch-status-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-batch-status/business-batch-status_export.pdf')
                res.send(html);
            }
        );
    }

}
