import * as dotenv from 'dotenv';
import { TranslationService } from '../libs/translation/service/translation.service';
import { HandlerRequestService } from '../libs/handler/service/request/handler.request.service';
import { AppModule } from 'src/app.module';

dotenv.config();

export const HBS_DEFAULT_HELPERS = {
  hellowWorld() {
    return 'Hello World !';
  },

  /**
   * Trans text in template Handlebars
   * @param options
   * @returns
   */
  trans(options: any) {
    const key = options.hash?.key;
    if (key) {
      const trans = AppModule.get(TranslationService);
      const params = options.hash?.params
        ? JSON.parse(options.hash?.params)
        : undefined;
      const domain = options.hash?.domain;
      const local = options.hash?.local;
      const createIfNotExist = options.hash?.createIfNotExist !== false;

      return trans.trans(key, params, domain, local, createIfNotExist);
    }

    return;
  },

  /**
   * Return Value from env
   * @param key
   */
  env(key: string) {
    return process.env[key];
  },

  /**
   * Return absolute url of path
   * @param path
   * @returns
   */
  absoluteUrl(path: string) {
    return AppModule.get(HandlerRequestService).getAbsoluteUrl(path);
  },

  /**
   * Return the route for image
   */
  imgPath(path: string) {
    if (path) {
      path = path.replace(/^[\/]+/, '');
      path = path.replace(/[\/]{2,}/, '/');
      return HBS_DEFAULT_HELPERS.absoluteUrl(`/img/${path}`);
    }
    return;
  },

  /**
   * Return the route for image
   */
  uplPath(path: string) {
    if (path) {
      path = path.replace(/^[\/]+/, '');
      path = path.replace(/[\/]{2,}/, '/');
      return HBS_DEFAULT_HELPERS.absoluteUrl(`/upload/${path}`);
    }
    return;
  },

  /**
   * Return the Site name
   * @returns
   */
  site_name() {
    return HBS_DEFAULT_HELPERS.env('SITE_NAME');
  },

  /**
   * Return the Copyright
   * @returns
   */
  copyright() {
    return HBS_DEFAULT_HELPERS.env('COPYRIGHT');
  },

  /**
   * Pdf Helper for image
   */
  parseImageUrl(value: any) {
    if (typeof value === 'string' && value.match(/img/i)) {
      const baseUrl = HBS_DEFAULT_HELPERS.absoluteUrl('/');
      value = value
        .replace('src="/', `src="${baseUrl}`)
        .replace("src='/", `src='${baseUrl}`);
    }

    return value;
  },
};
