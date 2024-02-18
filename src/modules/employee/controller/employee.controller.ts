
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmployeeService } from '../service/employee.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { EmployeeFilterArgInput } from '../dto/args/employee.filter.arg.input';
import { EmployeeTypeEnum } from '../dto/enums/employee.type.enum';
import { EmployeeColumnToDisplayBodInput } from '../dto/args/employee.column.to.display.bod.input';

@Controller('employee')
export class EmployeeController {

    public constructor(
        private readonly _service: EmployeeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/employee/download')
    public async exportPdfEmployee(
        @Res() res: Response,
        @Body() column: EmployeeColumnToDisplayBodInput,
        @Body() filter?: EmployeeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);
        const datasToDisplay = datas.map((em) => {
            if (em.type === EmployeeTypeEnum.EMPLOYEE)
                return {
                    lastname: em.lastname, firstname: em.firstname, entity: em.entity.label, position: em.position, category: "-", email: em.emailPro,
                    phone: em.phonePro, state: em.active === true ? "Actif" : "Inactif", picture: em.picture?.name,
                    //Columns
                    LNAME: column.lastname ? true : false,
                    FNAME: column.firstname ? true : false,
                    ENTITY: column.entity ? true : false,
                    POSITION: column.position ? true : false,
                    CAT: column.category ? true : false,
                    EMAIL: column.email ? true : false,
                    PHONE: column.phone ? true : false,
                    STATE: column.state ? true : false
                };
        })

        return res.render(
            'pdf/employee/employee-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'employee/employee_export.pdf')
                res.send(html);
            }
        );
    }

    @Post('/pdf/candidate/download')
    public async exportPdfCandidate(
        @Res() res: Response,
        @Body() column: EmployeeColumnToDisplayBodInput,
        @Body() filter?: EmployeeFilterArgInput
    ) {
        const datas = await this._service.findAll(filter);

        const datasToDisplay = datas.map((cand) => {
            if (cand.type === EmployeeTypeEnum.CANDIDATE)
                return {
                    lastname: cand.lastname, firstname: cand.firstname, entity: cand.entity.label,
                    position: cand.position, category: "-", email: cand.emailPro, phone: cand.phonePro,
                    picture: cand.picture?.name,
                    // Columns
                    LNAME: column.lastname ? true : false,
                    FNAME: column.firstname ? true : false,
                    ENTITY: column.entity ? true : false,
                    POSITION: column.position ? true : false,
                    CAT: column.category ? true : false,
                    EMAIL: column.email ? true : false,
                    PHONE: column.phone ? true : false,
                };
        })

        return res.render(
            'pdf/employee/candidate-export.hbs',
            { message: datasToDisplay, header: column },

            async (err, html) => {
                // Here you have access to the generated HTML
                // const data = await this._htmlToPdfService.fromContent(html, 'employee/candidate_export.pdf')
                res.send(html);
            }
        );
    }

}
