import { EntityService } from '../services/entity.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { EntityExportPdfArgInput } from '../dto/args/entity.export.pdf.arg.input';
import { previewPdfFile } from '../../../utils/html-to-pdf.utils';
import { LoginUserPermissionGuard } from '../../login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Controller('entity')
export class EntityController {
  public constructor(
    private readonly _service: EntityService,
    private readonly _htmlToPdfService: HtmlToPdfService,
  ) {}

  @Post('pdf/export')
  public async exportPdf(
    @Body()
    { filter, sort, columns }: EntityExportPdfArgInput,
    @Res()
    res: Response,
  ): Promise<void> {
    return this._previewByType(
      { filter, sort, columns },
      res,
      'entities.pdf',
      'Liste des entités',
    );
  }

  @Post('organization-chart/pdf/export')
  public async organizationChartExportPdf(
    @Body()
    { filter, sort, columns }: EntityExportPdfArgInput,
    @Res()
    res: Response,
  ): Promise<void> {
    filter.hasOrganigramme = true;

    return this._previewByType(
      { filter, sort, columns },
      res,
      'organization-chart.pdf',
      'Liste des organigrammes',
    );
  }

  @Post('information/pdf/export')
  public async informationExportPdf(
    @Body()
    { filter, sort, columns }: EntityExportPdfArgInput,
    @Res()
    res: Response,
  ): Promise<void> {
    filter.hasInformation = true;

    return this._previewByType(
      { filter, sort, columns },
      res,
      'information.pdf',
      'Liste des informations',
    );
  }

  /**
   * Export preview pdf
   * @param filter
   * @param sort
   * @param columns
   * @param res
   * @param filename
   * @param title
   * @private
   */
  private async _previewByType(
    { filter, sort, columns }: EntityExportPdfArgInput,
    res: Response,
    filename: string,
    title: string,
  ): Promise<void> {
    const entities = (await this._service.findAll(filter, sort)).map((e) => {
      const newFormat: any = {};

      for (const i in columns) {
        const column = columns[i];

        switch (column) {
          case 'id':
            newFormat[column] = e[column];
            break;
          case 'label':
            newFormat[column] = e[column];
            break;
          case 'logo':
            newFormat[
              column
            ] = `<img src="${e[column].fullpath}" alt="${e.label}" />`;
            break;
        }
      }

      return newFormat;
    });

    await previewPdfFile(
      res,
      this._htmlToPdfService,
      filename,
      title,
      columns,
      entities,
    );
  }
}
