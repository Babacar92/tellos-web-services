
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DocumentCategoryService } from '../service/document-category.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { DocumentCategoryFilterArgInput } from '../dto/args/document-category.filter.arg.input';
import { DocumentCategoryColumnToDisplayBodInput } from '../dto/args/document-category.column.to.display.bod.input';

@Controller('document-category')
export class DocumentCategoryController {

    public constructor(
        private readonly _service: DocumentCategoryService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: DocumentCategoryColumnToDisplayBodInput,
        @Body() filter?: DocumentCategoryFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((doccat) => {
            return {
                denomination: doccat.title, icon: doccat.icon,
                DENOM: column.denomination_c ? true : false, ICON: column.icon_c ? true : false
            };
        })

        return res.render(
            'pdf/document-category/document-category-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'document-category/document-category_export.pdf')
                res.send(html);
            }
        );
    }

}
