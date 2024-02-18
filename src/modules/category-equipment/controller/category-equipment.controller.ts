import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CategoryEquipmentService } from '../service/category-equipment.service';
import { HtmlToPdfService } from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import { CategoryEquipmentFilterArgInput } from '../dto/args/category-equipment.filter.arg.input';
import { CategoryEquipmentColumnToDisplayBodInput } from '../dto/args/category-equipment.column.to.display.bod.input';

@Controller('category-equipment')
export class CategoryEquipmentController {
  public constructor(
    private readonly _service: CategoryEquipmentService,
    private readonly _htmlToPdfService: HtmlToPdfService,
  ) {}

  @Post('/pdf/export')
  public async exportPdfQualification(
    @Res() res: Response,
    @Body() column: CategoryEquipmentColumnToDisplayBodInput,
    @Body() filter?: CategoryEquipmentFilterArgInput,
  ) {
    const datas = await this._service.findAll(filter);

    const datasToDisplay = datas.map((cat) => {
      return {
        code: cat.code,
        title: cat.title,
        CODE: !!column.code_c,
        TITLE: !!column.title_c,
      };
    });

    return res.render(
      'pdf/category-equipment/category-equipment-export.hbs',
      { message: datasToDisplay, header: column },

      async (err, html) => {
        // Here you have access to the generated HTML
        // const data = await this._htmlToPdfService.fromContent(html, 'category-equipment/category-equipment_export.pdf')
        res.send(html);
      },
    );
  }
}
