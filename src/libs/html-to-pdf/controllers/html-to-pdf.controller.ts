import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  HTML2PDF_UPLOAD_DIRNAME,
  HtmlToPdfService,
} from '../services/html-to-pdf.service';
import { dump, gen } from '../../../utils/utils';
import * as fs from 'fs';
import { Response } from 'express';

/**
 * The HTML to PDF Controller
 */
@Controller({
  path: 'html-to-pdf',
  host: ['localhost'],
})
export class HtmlToPdfController {
  /**
   * The contructor
   * @param _service
   */
  public constructor(private readonly _service: HtmlToPdfService) {}

  /**
   * Create pdf from page url
   * @param url
   * @param path
   * @returns
   */
  @Get('/from-url')
  public async fromUrl(
    @Body('url')
    url: string,
    @Body('path')
    path: string,
  ): Promise<any> {
    return this._service.fromUrl(url, path);
  }

  /**
   * Create pdf from page template
   * @param template
   * @param path
   * @returns
   */
  @Get('/from-template')
  public async fromTemplate(
    @Body('template')
    template: string,
    @Body('path')
    path: string,
  ): Promise<any> {
    return this._service.fromTemplate(template, path);
  }

  @Get('/download/:path')
  @Header('Cache-Control', 'none')
  public async download(
    @Res({ passthrough: true })
    res: Response,
    @Param('path')
    path: string,
  ): Promise<StreamableFile> {
    return new Promise<StreamableFile>(async (resolve, reject) => {
      path = path.replace(/\.pdf$/i, '');
      path = path.replace(/\./g, '/');
      path += '.pdf';

      const fullPath = `${HTML2PDF_UPLOAD_DIRNAME}/${path}`;

      if (fs.existsSync(fullPath)) {
        const file = fs.createReadStream(fullPath);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${gen(
            10,
            true,
            true,
            true,
            false,
          )}.pdf"`,
        });

        return resolve(new StreamableFile(file));
      }

      resolve(null);
    });
  }
}
