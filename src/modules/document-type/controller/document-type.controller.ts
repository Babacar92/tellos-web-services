
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DocumentTypeService } from '../service/document-type.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { DocumentTypeFilterArgInput } from '../dto/args/document-type.filter.arg.input';
import { DocumentTypeColumnToDisplayBodInput } from '../dto/args/document-type.column.to.display.bod.input';

@Controller('document-type')
export class DocumentTypeController {

    public constructor(
        private readonly _service: DocumentTypeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: DocumentTypeColumnToDisplayBodInput,
        @Body() filter?: DocumentTypeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((doctype) => {
            return {
                denomination: doctype.title, category: doctype.category.title,
                DENOM: column.denomination_c ? true : false, CATEGORY: column.category_c ? true : false
            };
        })

        return res.render(
            'pdf/document-type/document-type-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'document-type/document-type_export.pdf')
                res.send(html);
            }
        );
    }

}
