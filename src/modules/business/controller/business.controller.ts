import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BusinessService } from '../service/business.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { previewPdfFile } from '../../../utils/html-to-pdf.utils';
import { BusinessExportArgInput } from '../dto/args/business.export.arg.input';

@Controller('business')
export class BusinessController {
    public constructor(
        private readonly _service: BusinessService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) {}

    @Post('/pdf/export')
    public async exportPdf(
        @Body()
        { filter, sort, columns }: BusinessExportArgInput,
        @Res()
        res: Response,
    ) {
        const businesss = (await this._service.findAll(filter, sort)).map(
            (business) => {
                const newFormat: any = {};

                for (const i in columns) {
                    const column = columns[i];

                    switch (column) {
                        case 'formattedType':
                            newFormat[column] = business.type;
                            break;
                        case 'formattedEstimatedAmount':
                            newFormat[column] = business.estimatedAmount;
                            break;
                        case 'formattedTenderType':
                            newFormat[column] = business.tenderType;
                            break;
                        case 'formattedMarketType':
                            newFormat[column] = business.tenderType;
                            break;
                        case 'formattedLimiteDate':
                            newFormat[column] = business.limiteDate;
                            break;
                        case 'formattedStatus':
                            newFormat[column] = business.status;
                            break;
                        default:
                            newFormat[column] = business[column];
                            break;
                    }
                }

                return newFormat;
            },
        );

        await previewPdfFile(
            res,
            this._htmlToPdfService,
            'business.pdf',
            'Liste des projets',
            columns.map((c) => {
                switch (c) {
                    case 'formattedType':
                        return 'Type';
                    case 'label':
                        return 'Libellé';
                    case 'payingOwner':
                        return "Maitre d'ouvrage";
                    case 'formattedEstimatedAmount':
                        return 'Montant estimé';
                    case 'formattedTenderType':
                        return 'Type AO';
                    case 'formattedMarketType':
                        return 'Type de marché';
                    case 'formattedLimiteDate':
                        return 'Date limite';
                    case 'formattedStatus':
                        return 'État';
                }

                return c;
            }),
            businesss,
        );
    }
}
