import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerController } from './controller/mailer.controller';
import { HBS_DEFAULT_HELPERS } from '../../utils/hbs.utils';
import { MailerResolver } from './resolvers/mailer.resolver';
import * as dotenv from 'dotenv';
import { dump } from '../../utils/utils';

dotenv.config();

const {
  MAILER_HOST,
  MAILER_PORT,
  MAILER_IGNORE_TLS,
  MAILER_SECURE,
  MAILER_USER,
  MAILER_PASS,
  MAILER_FROM,
  PWD,
} = process.env;

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: MAILER_HOST,
        port: parseInt(MAILER_PORT),
        ignoreTLS: MAILER_IGNORE_TLS === 'true',
        secure: MAILER_SECURE === 'true',
        auth: {
          user: MAILER_USER,
          pass: MAILER_PASS,
        },
      },
      defaults: {
        from: MAILER_FROM,
      },
      template: {
        dir: PWD + '/dist/templates/mail',
        adapter: new HandlebarsAdapter(HBS_DEFAULT_HELPERS),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: PWD + '/dist/templates/mail/partials',
          options: {
            strict: true,
          },
        },
      },
    }),
  ],
  controllers: [
    MailerController,
  ],
  providers: [
    MailerResolver,
  ],
})
export class MailerModule { }
