
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessPaymentTypeService } from '../service/business-payment-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessPaymentTypeFilterArgInput } from '../dto/args/business-payment-type.filter.arg.input';
import { BusinessPaymentTypeColumnToDisplayBodInput } from '../dto/args/business-payment-type.column.to.display.bod.input';

@Controller('business-payment-type')
export class BusinessPaymentTypeController {

    public constructor(
        private readonly _service: BusinessPaymentTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessPaymentTypeColumnToDisplayBodInput,
        @Body() filter?: BusinessPaymentTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-payment-type/business-payment-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-payment-type/business-payment-type_export.pdf')
                res.send(html);
            }
        );
    }

}
