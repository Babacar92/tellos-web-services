
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContractTypePaymentService } from '../service/contract-type-payment.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { ContractTypePaymentFilterArgInput } from '../dto/args/contract-type-payment.filter.arg.input';
import { ContractTypePaymentColumnToDisplayBodInput } from '../dto/args/contract-type-payment.column.to.display.bod.input';

@Controller('contract-type-payment')
export class ContractTypePaymentController {

    public constructor(
        private readonly _service: ContractTypePaymentService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQ(
        @Res() res: Response,
        @Body() column: ContractTypePaymentColumnToDisplayBodInput,
        @Body() filter?: ContractTypePaymentFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                id: sc.id, title: sc.title,
                ID: column.id_c ? true : false, TITLE: column.title_c ? true : false
            };
        })

        return res.render(
            'pdf/contract-type-payment/contract-type-payment-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'contract-type-payment/contract-type-payment_export.pdf')
                res.send(html);
            }
        );
    }

}
