
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { QualificationService } from '../service/qualification.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { QualificationFilterArgInput } from '../dto/args/qualification.filter.arg.input';
import { QualificationStatusEnum } from '../dto/enums/qualification.status.enum';
import { QualificationColumnToDisplayBodInput } from '../dto/args/qualification.column.to.display.bod.input';

@Controller('qualification')
export class QualificationController {

    public constructor(
        private readonly _service: QualificationService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/export')
    public async exportPdfQualification(
        @Res() res: Response,
        @Body() column: QualificationColumnToDisplayBodInput,
        @Body() filter?: QualificationFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((qual) => {
            return {
                employee: qual.employee.firstname + " " + qual.employee.lastname, number: qual.number, type: qual.type.name,
                qualification: qual.name.name, delivery: qual.delivery, validity: qual.validity, deadline: qual.deadline,
                comment: qual.comment, status: qual.status === QualificationStatusEnum.VALIDATED ? "Validée" : qual.status === QualificationStatusEnum.REFUSED ? "Refusée" : "Validation en attente",
                //the columns
                EMPL: column.employee_c ? true : false,
                NUMBER: column.number_c ? true : false,
                TYPE: column.type_c ? true : false,
                QUALIF: column.qualification_c ? true : false,
                DELIV: column.delivery_c ? true : false,
                VALID: column.validity_c ? true : false,
                DLINE: column.deadline_c ? true : false,
                COM: column.comment_c ? true : false,
                STUS: column.status_c ? true : false,
            };
        })

        return res.render(
            'pdf/qualification/qualification-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'qualification/qualification_export.pdf')
                res.send(html);
            }
        );
    }

}
