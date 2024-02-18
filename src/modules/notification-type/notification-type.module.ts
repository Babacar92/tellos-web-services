import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { NotificationTypeExistByColumnConstraint } from './constraints/notification-type.exist.by.column.constraints';
import { NotificationTypeExistConstraint } from './constraints/notification-type.exist.constraint';
import { NotificationTypeNotExistByColumnConstraint } from './constraints/notification-type.not.exist.by.column.constraints';
import { NOTIFICATION_TYPE_PROVIDERS } from './dto/provider/notification-type.providers';
import { NotificationTypeResolver } from './resolver/notification-type.resolver';
import { NotificationTypeService } from './service/notification-type.service';
import { GraphModule } from 'src/libs/graphql/graph.module';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { NotificationTypeController } from './controller/notification-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    GraphModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...NOTIFICATION_TYPE_PROVIDERS,
    NotificationTypeService,
    NotificationTypeResolver,
    NotificationTypeExistConstraint,
    NotificationTypeExistByColumnConstraint,
    NotificationTypeNotExistByColumnConstraint,
  ],
  exports: [
    NotificationTypeService,
  ],
  controllers: [NotificationTypeController],
})
export class NotificationTypeModule { }
