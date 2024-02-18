
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessPaymentModeService } from '../service/business-payment-mode.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessPaymentModeFilterArgInput } from '../dto/args/business-payment-mode.filter.arg.input';
import { BusinessPaymentModeColumnToDisplayBodInput } from '../dto/args/business-payment-mode.column.to.display.bod.input';

@Controller('business-payment-mode')
export class BusinessPaymentModeController {

    public constructor(
        private readonly _service: BusinessPaymentModeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessPaymentModeColumnToDisplayBodInput,
        @Body() filter?: BusinessPaymentModeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-payment-mode/business-payment-mode-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-payment-mode/business-payment-mode_export.pdf')
                res.send(html);
            }
        );
    }

}
