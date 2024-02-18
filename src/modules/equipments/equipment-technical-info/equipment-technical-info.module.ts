
//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';

//Resolvers

//Controllers

//Services

//Constraints

@Module({
  imports: [
    TranslationModule,
    DatabaseModule,
  ],
  providers: [
  ],
  exports: [],
})
export class EquipmentTechnicalInfoModule {}
