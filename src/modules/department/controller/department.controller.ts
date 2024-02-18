
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DepartmentService } from '../services/department.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { DepartmentFilterArgInput } from '../dto/args/department.filter.arg.input';
import { DepartmentColumnToDisplayBodInput } from '../dto/args/department.to.display.bod.input';

@Controller('department')
export class DepartmentController {

    public constructor(
        private readonly _service: DepartmentService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdf(
        @Res() res: Response,
        @Body() column: DepartmentColumnToDisplayBodInput,
        @Body() filter?: DepartmentFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((depart) => {
            return {
                service: depart.name, SERVICE: column.service ? true : false
            };
        })


        return res.render(
            'pdf/department/department-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'department/department_export.pdf')
                res.send(html);
            }
        );
    }

}
