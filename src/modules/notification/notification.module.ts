import { Module } from "@nestjs/common";
import { NotificationService } from './service/notification.service';
import { DatabaseModule } from "src/libs/databases/databases.module";
import { ActionLogModule } from "../action-log/action-log.module";
import { TranslationModule } from "src/libs/translation/translation.module";
import { NotificationTypeModule } from "../notification-type/notification-type.module";
import { NOTIFICATION_PROVIDERS } from "./dto/provider/notification.providers";
import { NotificationExistConstraint } from "./constraints/notification.exist.constraint";
import { NotificationExistByColumnConstraint } from "./constraints/notification.exist.by.column.constraints";
import { NotificationNotExistByColumnConstraint } from "./constraints/notification.not.exist.by.column.constraints";
import { NotificationResolver } from "./resolver/notification.resolver";
import { GraphModule } from "src/libs/graphql/graph.module";

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        NotificationTypeModule,
        GraphModule,
    ],
    providers: [
        ...NOTIFICATION_PROVIDERS,
        NotificationResolver,
        NotificationService,
        NotificationExistConstraint,
        NotificationExistByColumnConstraint,
        NotificationNotExistByColumnConstraint,
    ],
    exports: [
        NotificationService,
    ],
})
export class NotificationModule { }