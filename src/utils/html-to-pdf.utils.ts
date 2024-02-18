import { Response } from 'express';
import { HtmlToPdfService } from '../libs/html-to-pdf/services/html-to-pdf.service';
import { gen } from './utils';
import * as fs from 'fs';
import { Readable } from 'stream';

/**
 * Show the preview of pdf
 * @param res
 * @param htmlToPdfService
 * @param filename
 * @param title
 * @param columns
 * @param items
 */
export const previewPdfFile = async (
  res: Response,
  htmlToPdfService: HtmlToPdfService,
  filename: string,
  title: string,
  columns: string[],
  items: any[],
): Promise<void> => {
  res.render(
    'pdf/exporter/exporter.hbs',
    {
      title: title,
      columns: columns.map((c) => c.toUpperCase()),
      items: items,
    },
    async (err, html) => {
      if (err) {
        res.send(err.message);
      } else {
        const exportFilename = gen(8, true, true, false, false);
        const fileData: any = await htmlToPdfService.fromContent(
          html,
          `exporter/${exportFilename}.pdf`,
        );

        if (fileData.buffer) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename=${filename}`);
          const stream = Readable.from(fileData.buffer);
          stream.pipe(res);
          fs.unlinkSync(fileData.fullPath);
        } else {
          res.send("Erreur lors de l'export");
        }
      }
    },
  );
};
