import './dto/init/database.init';
import { Module } from '@nestjs/common';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { databasesProviders } from './provider/databases.providers';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();

// MongoDB Connection Name
export const ACTION_LOG_MONGODB_CONN_NAME = 'mongodb';

const {
  // MONGODB VARIABLES
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DB_NAME,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
} = process.env;

@Module({
  imports: [
    TranslationModule,
    MongooseModule.forRoot(
      `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB_NAME}`,
      {
        connectionName: ACTION_LOG_MONGODB_CONN_NAME,
      },
    ),
  ],
  providers: [...databasesProviders],
  exports: [...databasesProviders],
})
export class DatabaseModule {}
