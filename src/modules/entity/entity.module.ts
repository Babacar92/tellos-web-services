import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { EntityService } from './services/entity.service';
import { EntityResolver } from './resolvers/entity.resolver';
import { ActionLogModule } from '../action-log/action-log.module';
import { ENTITY_PROVIDERS } from './dto/provider/entity.providers';
import { EntityExistConstraint } from './constraints/entity.exist.constraint';
import { UploadModule } from 'src/libs/upload/upload.module';
import { EntityExistByColumnConstraint } from './constraints/entity.exist.by.column.constraints';
import { EntityNotExistByColumnConstraint } from './constraints/entity.not.exist.by.column.constraints';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { EntityController } from './controller/entity.controller';
import { EntityLogger } from './logger/entity.logger';

@Module({
    imports: [
        DatabaseModule,
        TranslationModule,
        ActionLogModule,
        UploadModule,
        HtmlToPdfModule,
    ],
    providers: [
        ...ENTITY_PROVIDERS,
        EntityService,
        EntityResolver,
        EntityExistConstraint,
        EntityExistByColumnConstraint,
        EntityNotExistByColumnConstraint,
        EntityLogger,
    ],
    exports: [
        EntityService,
    ],
    controllers: [EntityController],
})
export class EntityModule { }
