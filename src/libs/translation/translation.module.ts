import { Module } from '@nestjs/common';
import { TranslationService } from './service/translation.service';
import { TranslationController } from './controller/translation.controller';
import { HandlerModule } from '../handler/handler.module';
import { TranslationResolver } from './resolver/translation.resolver';
import { TranslationValidateConstraint } from './constraint/translation.validate.constraint';

@Module({
  imports: [
    HandlerModule,
  ],
  exports: [
    TranslationService,
  ],
  providers: [
    TranslationService,
    TranslationResolver,
    TranslationValidateConstraint,
  ],
  controllers: [
    TranslationController,
  ],
})
export class TranslationModule { }
