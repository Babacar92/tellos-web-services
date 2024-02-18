
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InseeCodeService } from '../service/insee-code.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { InseeCodeFilterArgInput } from '../dto/args/insee-code.filter.arg.input';

@Controller('insee-code')
export class InseeCodeController {

    public constructor(
        private readonly _service: InseeCodeService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) { }

    @Post('/pdf/download')
    public async exportPdf(
        @Res() res: Response,
        
        @Body() filter?: InseeCodeFilterArgInput
    ) {
       
    }

}
