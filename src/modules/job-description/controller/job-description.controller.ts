
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobDescriptionService } from '../service/job-description.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { JobDescriptionFilterArgInput } from '../dto/args/job-description.filter.arg.input';
import { JobDescriptionColumnToDisplayBodInput } from '../dto/args/job-description.column.to.display.bod.input';

@Controller('job-description')
export class JobDescriptionController {

    public constructor(
        private readonly _service: JobDescriptionService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfJobDescription(
        @Res() res: Response,
        @Body() column: JobDescriptionColumnToDisplayBodInput,
        @Body() filter?: JobDescriptionFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((jd) => {
            return {
                number: jd.number, denomination: jd.title, entity: jd.entity.label, service: jd.department.name, totalEmplyee: jd.totalEmployees,
                NUMBER: column.number ? true : false, DENOM: column.denomination ? true : false, ENTITY: column.entity ? true : false,
                SERVICE: column.service ? true : false, TEMPL: column.totalEmplyee ? true : false
            };
        })

        return res.render(
            'pdf/job-description/job-description-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'job-description/job-description_export.pdf')
                res.send(html);
            }
        );
    }

}
