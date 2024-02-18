import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CategoryEquipmentExistByColumnConstraint } from './constraints/category-equipment.exist.by.column.constraints';
import { CategoryEquipmentExistConstraint } from './constraints/category-equipment.exist.constraint';
import { CategoryEquipmentNotExistByColumnConstraint } from './constraints/category-equipment.not.exist.by.column.constraints';
import { CATEGORY_EQUIPMENT_PROVIDERS } from './dto/provider/category-equipment.providers';
import { CategoryEquipmentResolver } from './resolver/category-equipment.resolver';
import { CategoryEquipmentService } from './service/category-equipment.service';
import { CategoryEquipmentLogger } from './logger/category-equipment.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { CategoryEquipmentController } from './controller/category-equipment.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CATEGORY_EQUIPMENT_PROVIDERS,
    CategoryEquipmentService,
    CategoryEquipmentResolver,
    CategoryEquipmentExistConstraint,
    CategoryEquipmentExistByColumnConstraint,
    CategoryEquipmentNotExistByColumnConstraint,
    CategoryEquipmentLogger,
  ],
  exports: [
    CategoryEquipmentService,
  ],
  controllers: [CategoryEquipmentController],
})
export class CategoryEquipmentModule { }
