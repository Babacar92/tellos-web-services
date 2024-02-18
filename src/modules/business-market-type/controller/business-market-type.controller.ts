
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessMarketTypeService } from '../service/business-market-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { BusinessMarketTypeFilterArgInput } from '../dto/args/business-market-type.filter.arg.input';
import { BusinessMarketTypeColumnToDisplayBodInput } from '../dto/args/business-market-type.column.to.display.bod.input';

@Controller('business-market-type')
export class BusinessMarketTypeController {

    public constructor(
        private readonly _service: BusinessMarketTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: BusinessMarketTypeColumnToDisplayBodInput,
        @Body() filter?: BusinessMarketTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((sc) => {
            return {
                denomination: sc.title,
                DENOM: column.denomination ? true : false
            };
        })

        return res.render(
            'pdf/business-market-type/business-market-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'business-market-type/business-market-type_export.pdf')
                res.send(html);
            }
        );
    }

}
