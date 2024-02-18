import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { DepartmentExistByColumnConstraint } from './constraints/department.exist.by.column.constraints';
import { DepartmentExistConstraint } from './constraints/department.exist.constraint';
import { DepartmentNotExistByColumnConstraint } from './constraints/department.not.exist.by.column.constraints';
import { DEPARTMENT_PROVIDERS } from './dto/provider/department.providers';
import { DepartmentResolver } from './resolvers/department.resolver';
import { DepartmentService } from './services/department.service';
import { DepartmentLogger } from './logger/department.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { DepartmentController } from './controller/department.controller';

@Module({
    imports: [
        DatabaseModule,
        TranslationModule,
        ActionLogModule,
        HtmlToPdfModule,
    ],
    providers: [
        ...DEPARTMENT_PROVIDERS,
        DepartmentService,
        DepartmentResolver,
        DepartmentExistConstraint,
        DepartmentExistByColumnConstraint,
        DepartmentNotExistByColumnConstraint,
        DepartmentLogger,
    ],
    exports: [
        DepartmentService,
    ],
    controllers: [DepartmentController],
})
export class DepartmentModule { }
