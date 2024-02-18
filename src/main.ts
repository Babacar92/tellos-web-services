import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { handleValidationErrors } from './utils/utils';
import { useContainer } from 'class-validator';
import { HBS_DEFAULT_HELPERS } from './utils/hbs.utils';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import { ValidationExceptionFilter } from './libs/validation/exception/ValidationExceptionFilter';

const { PWD } = process.env;

async function bootstrap() {
  const version = "1.0.2";
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Save App in app module
  AppModule.setApplication(app);

  // Set API Prefix
  const { API_HASH } = process.env;
  const apiPrefix = `/api-${API_HASH}`;

  // Catch errors
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Set Validation global check
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: handleValidationErrors,
    }),
  );

  // Base dir for email template
  app.useStaticAssets(`${PWD}/dist/public`, {
    prefix: apiPrefix,
  });
  app.setBaseViewsDir(`${PWD}/dist/templates`);
  app.setViewEngine('hbs');
  hbs.registerPartials(`${PWD}/dist/templates/partials`);
  for (const _helperName in HBS_DEFAULT_HELPERS) {
    const _helperFunction = HBS_DEFAULT_HELPERS[_helperName];
    hbs.registerHelper(_helperName, _helperFunction);
  }

  // Add global prefix
  app.setGlobalPrefix(apiPrefix, {
    exclude: [],
  });

  // Add injection to dependancies
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  // Use Cookie parser
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
