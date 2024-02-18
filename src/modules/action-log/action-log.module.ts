import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ActionLog, ActionLogDocument, ActionLogSchema } from '../../entities/mongodb/ActionLogSchema';
import { ACTION_LOG_MONGODB_CONN_NAME, DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { ActionLogService } from './services/action-log.service';
import { Model } from 'mongoose';

const providers = [
    {
        provide: ActionLogService,
        useFactory(
            model: Model<ActionLogDocument>,
        ) {
            return new ActionLogService(model);
        },
        inject: [
            getModelToken(ActionLog.name, ACTION_LOG_MONGODB_CONN_NAME),
        ],
    },
];

@Module({
    imports: [
        DatabaseModule,
        TranslationModule,
        MongooseModule.forFeature([
            {
                name: ActionLog.name,
                schema: ActionLogSchema,
            }
        ], ACTION_LOG_MONGODB_CONN_NAME),
    ],
    providers: [
        ActionLogService,
    ],
    exports: [
        ActionLogService,
    ],
})
export class ActionLogModule { }
