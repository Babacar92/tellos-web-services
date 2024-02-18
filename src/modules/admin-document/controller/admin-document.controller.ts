import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AdminDocumentService } from '../service/admin-document.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { AdminDocumentArgInput } from '../dto/args/admin-document.arg.input';
import { previewPdfFile } from '../../../utils/html-to-pdf.utils';
import { dateToTimestamp } from '../../../utils/utils';
import { LoginUserPermissionGuard } from '../../login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Controller('admin-document')
export class AdminDocumentController {
  public constructor(
    private readonly _service: AdminDocumentService,
    private readonly _htmlToPdfService: HtmlToPdfService,
  ) {}

  @Post('pdf/export')
  public async exportPdf(
    @Body()
    { filter, sort, columns }: AdminDocumentArgInput,
    @Res()
    res: Response,
  ) {
    const adminDocuments = (await this._service.findAll(filter, sort)).map(
      (ad) => {
        const newFormat: any = {};

        for (const i in columns) {
          const column = columns[i];

          switch (column) {
            case 'date':
              newFormat[column] = dateToTimestamp(ad.createdAt, 'd/m/Y H:i');
              break;
            case 'title':
              newFormat[column] = ad[column];
              break;
            case 'formattedCategory':
              newFormat[column] = ad.category?.title;
              break;
            case 'formattedCreatedBy':
              newFormat[column] = ad.createdBy;
              break;
          }
        }

        return newFormat;
      },
    );

    await previewPdfFile(
      res,
      this._htmlToPdfService,
      'admin-document.pdf',
      'Liste des documents admins',
      columns.map((c) => {
        switch (c) {
          case 'formattedCategory':
            return 'Catégorie';
          case 'formattedCreatedBy':
            return 'Créé par';
        }

        return c;
      }),
      adminDocuments,
    );
  }
}
