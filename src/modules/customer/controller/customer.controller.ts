import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomerService } from '../service/customer.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { dateToTimestamp } from '../../../utils/utils';
import { previewPdfFile } from '../../../utils/html-to-pdf.utils';
import { CustomerExportArgInput } from '../dto/args/customer.export.arg.input';

@Controller('customer')
export class CustomerController {
  public constructor(
    private readonly _service: CustomerService,
    private readonly _htmlToPdfService: HtmlToPdfService,
  ) {}

  @Post('/pdf/export')
  public async exportPdf(
    @Body()
    { filter, sort, columns }: CustomerExportArgInput,
    @Res()
    res: Response,
  ) {
    const customers = (await this._service.findAll(filter, sort)).map(
      (customer) => {
        const newFormat: any = {};

        for (const i in columns) {
          const column = columns[i];

          switch (column) {
            case 'formattedFamilly':
              newFormat[column] = customer.familly;
              break;
            case 'formattedTypology':
              newFormat[column] = customer.typology;
              break;
            case 'activeLabel':
              newFormat[column] = customer.active ? 'Actif' : 'Inactif';
              break;
            default:
              newFormat[column] = customer[column];
              break;
          }
        }

        return newFormat;
      },
    );

    await previewPdfFile(
      res,
      this._htmlToPdfService,
      'customer.pdf',
      'Liste des clients',
      columns.map((c) => {
        switch (c) {
          case 'formattedFamilly':
            return 'Famille';
          case 'formattedTypology':
            return 'Typologie';
          case 'activeLabel':
            return 'État';
        }

        return c;
      }),
      customers,
    );
  }
}
