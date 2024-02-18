import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { slug } from '../../../utils/utils';
import {
  ImageResizeInterface,
  UPLOAD_IMAGE_SIZE_MAX,
} from '../dto/interfaces/upload.image.inerfaces';
import sizeOf from 'image-size';
import { UPLOAD_DIRNAME, UPLOAD_MODE } from './upload.service';
import { extFilename, PUBLIC_BASE_DIR } from '../../../utils/upload.utils';

/**
 * The WYSIWYG directory
 */
export const WYSIWYG_DIRNAME = 'wysiwyg';

/**
 * The service of resize image
 */
@Injectable()
export class ImageResizeService {
  /**
   * Return all CKEditor files
   * @returns
   */
  public async getCKEditorFiles(): Promise<
    { name: string; path: string; min: string }[]
  > {
    return new Promise(async (resolve, reject) => {
      const paths: { name: string; path: string; min: string }[] = [];

      // Set directory
      const directory = `/${UPLOAD_DIRNAME}/${WYSIWYG_DIRNAME}`;
      const fullDirectory = `${PUBLIC_BASE_DIR}${directory}`;

      if (fs.existsSync(fullDirectory)) {
        const files = fs.readdirSync(fullDirectory);

        for (const i in files) {
          const file = files[i];

          if (!file.match(/\-min\./)) {
            const path = `${directory}/${file}`;
            const ext = extFilename(file);
            paths.push({
              name: file,
              path: path,
              min: path.replace(`.${ext}`, `-min.${ext}`),
            });
          }
        }
      }

      resolve(paths);
    });
  }

  /**
   * Save a new images for CKEDITOR and resize it
   * @param file
   * @returns
   */
  public async saveCKEditorFile(
    file: Express.Multer.File,
  ): Promise<{ name?: string; min?: string; path?: string }> {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        resolve({});
        return;
      }

      // Get extension of file
      const ext = extFilename(file.originalname);

      // Set directory
      const directory = `${PUBLIC_BASE_DIR}/${UPLOAD_DIRNAME}/${WYSIWYG_DIRNAME}`;

      // Set filename
      const filename = `${directory}/${slug(
        file.originalname.replace(`.${ext}`, ''),
      )}.${ext}`;

      // Set min filename
      const minFilename = filename.replace(`.${ext}`, `-min.${ext}`);

      // Save it if not exist
      if (!fs.existsSync(filename)) {
        // Create the directory
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true, mode: UPLOAD_MODE });
        }

        // Check the dimensions
        const dimensions = sizeOf(file.buffer);

        if (
          dimensions.width > UPLOAD_IMAGE_SIZE_MAX ||
          dimensions.height > UPLOAD_IMAGE_SIZE_MAX
        ) {
          if (dimensions.width > dimensions.height) {
            // Save default and resize width
            const resizedData = await this._sharpResizeFile(
              file.buffer,
              {
                width: UPLOAD_IMAGE_SIZE_MAX,
              },
              filename,
            );
          } else {
            // Save default and resize height
            const resizedData = await this._sharpResizeFile(
              file.buffer,
              {
                height: UPLOAD_IMAGE_SIZE_MAX,
              },
              filename,
            );
          }
        } else {
          fs.writeFileSync(filename, file.buffer, {
            mode: UPLOAD_MODE,
            encoding: 'utf8',
          });
        }

        // Create miniature
        const resizedMiniatureData = await this._sharpResizeFile(
          filename,
          {
            width: 500,
          },
          minFilename,
        );

        // Set 777 Mode one path filename
        fs.chmodSync(filename, UPLOAD_MODE);

        // Set 777 Mode one path minFilename
        fs.chmodSync(minFilename, UPLOAD_MODE);
      }

      resolve({
        name: file.originalname,
        min: minFilename.replace(PUBLIC_BASE_DIR, ''),
        path: filename.replace(PUBLIC_BASE_DIR, ''),
      });
    });
  }

  /**
   * Resize an image
   * @param dirnameSource
   * @param filenameSource
   * @param resizes
   * @returns
   */
  public async resizeImage(
    dirnameSource: string,
    filenameSource: string,
    resizes: ImageResizeInterface,
  ): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const paths: string[] = [];
      dirnameSource = dirnameSource.replace(/[\/]+/, '/');
      dirnameSource = dirnameSource.replace(/[\/]+$/, '');
      const filepath = `${dirnameSource}/${filenameSource}`;

      if (fs.existsSync(filepath)) {
        for (const _k in resizes) {
          // Get resize
          const resize = resizes[_k];

          // Init options
          const options: any = { width: resize.width };

          // Set height if defined
          if (resize.height) options.height = resize.height;

          // Set aspect ration if defined and true or undefined
          if (
            (typeof resize.aspectRation === 'boolean' && resize.aspectRation) ||
            typeof resize.aspectRation !== 'boolean'
          ) {
            options.fit = 'inside';
          }

          // Set directeory and create it if not exist
          const directory = dirnameSource.replace(/[a-z0-9\_\-\. ]+$/i, _k);
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true, mode: UPLOAD_MODE });
          }

          // Resize image and save hit
          const newPath = `${directory}/${filenameSource}`;

          // Resize by type
          const resizedData = await this._sharpResizeFile(
            filepath,
            options,
            newPath,
          );

          // Set 777 Mode one path filename
          fs.chmodSync(newPath, UPLOAD_MODE);

          paths.push(newPath);
        }
      }

      resolve(paths);
    });
  }

  /**
   * Resize the image with sharp
   * @param file
   * @returns
   */
  private async _sharpResizeFile(
    file: string | Buffer,
    resizeOptions: { [key: string]: any },
    filename: string,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let res;

      if (typeof file === 'string' && !fs.existsSync(file)) {
        res = {
          error: true,
          message: `File ${file} doesn't exist`,
        };
      }

      if (!res) {
        try {
          // First instance
          const sharpInstance = sharp(file, { failOnError: false });

          // Get his orientation
          const { orientation } = await sharpInstance.metadata();

          // Set resized data
          const resizedData = await sharpInstance
            .rotate()
            .resize(
              Object.assign(
                {
                  fit: 'inside',
                },
                resizeOptions,
              ),
            )
            .withMetadata({ orientation })
            .toFile(filename);

          // The response of resize
          res = resizedData;
        } catch (e) {
          res = {
            error: true,
            message: `Error on resize`,
            errMessage: e.message,
          };
        }
      }

      resolve(res);
    });
  }
}
