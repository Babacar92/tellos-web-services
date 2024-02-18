import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentDocumentExistByColumnConstraint } from './constraints/equipment-document.exist.by.column.constraints';
import { EquipmentDocumentExistConstraint } from './constraints/equipment-document.exist.constraint';
import { EquipmentDocumentNotExistByColumnConstraint } from './constraints/equipment-document.not.exist.by.column.constraints';
import { EQUIPMENT_DOCUMENT_PROVIDERS } from './dto/provider/equipment-document.providers';
import { EquipmentDocumentResolver } from './resolver/equipment-document.resolver';
import { EquipmentDocumentService } from './service/equipment-document.service';
import { EquipmentDocumentLogger } from './logger/equipment-document.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { EquipmentDocumentCheckStartAndEndDateConstraint } from './constraints/equipment.check.start.and.end.date.constraint';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...EQUIPMENT_DOCUMENT_PROVIDERS,
    EquipmentDocumentService,
    EquipmentDocumentResolver,
    EquipmentDocumentExistConstraint,
    EquipmentDocumentExistByColumnConstraint,
    EquipmentDocumentNotExistByColumnConstraint,
    EquipmentDocumentLogger,
    EquipmentDocumentCheckStartAndEndDateConstraint,
  ],
  exports: [
    EquipmentDocumentService,
  ],
})
export class EquipmentDocumentModule { }
