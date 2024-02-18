import { Body, Controller, Post, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadEntity } from '../../../entities/psql/UploadEntity';
import { dump } from '../../../utils/utils';
import { UploadImageControleResize } from '../dto/args/upload.file.resize.arg';
import { UploadRemoveArg } from '../dto/args/upload.remove.arg';
import { ImageResizeService } from '../service/image.resize.service';
import { UploadService } from '../service/upload.service';

@Controller({
    path: 'upload',
})
export class UploadController {

    public constructor(
        private readonly _service: UploadService,
        private readonly _imageResizeServie: ImageResizeService,
    ) { }

    @Post('/find-one')
    public async findOne(
        @Body('id')
        id: number,
    ): Promise<UploadEntity> {
        return this._service.findOne(id);
    }

    @Post('/file')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(
        @UploadedFile()
        file: Express.Multer.File,
        @Body()
        { resize }: UploadImageControleResize,
    ): Promise<any> {
        return this._service.saveFromUpload(file, resize, upload => {
            dump(upload);
        });
    }

    @Post('/files')
    @UseInterceptors(FilesInterceptor('files'))
    public async uploadFiles(
        @UploadedFiles()
        files: Express.Multer.File[],
        @Body()
        { resize }: UploadImageControleResize,
    ): Promise<any> {
        return this._service.saveFromUploadMultiple(files, resize, upload => {
            dump(upload);
        });
    }

    @Post('/remove')
    public async remove(
        @Body()
        req: UploadRemoveArg,
    ): Promise<boolean> {
        return this._service.remove(req);
    }

    @Post('/ckeditor/save')
    @UseInterceptors(FileInterceptor('upload'))
    public async uploadFromCKEditor(
        @UploadedFile()
        upload: Express.Multer.File,
        @Query('CKEditor')
        CKEditor: string,
        @Query('CKEditorFuncNum')
        CKEditorFuncNum: number,
        @Query('forListing')
        forListing?: number,
        @Query('responseType')
        responseType?: string,
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const file = await this._imageResizeServie.saveCKEditorFile(upload);

            if (forListing) {
                const paths = await this._imageResizeServie.getCKEditorFiles();
                resolve(paths);
            } else if (responseType === 'json') {
                resolve({
                    fileName: file?.name,
                    uploaded: !!file ? 1 : 0,
                    url: `/api${file?.path}`,
                });
            } else {
                resolve(`
                    <script type="text/javascript">
                        window.parent.CKEDITOR.tools.callFunction("${CKEditorFuncNum}", "/api${file?.path}");
                    </script>
                `);
            }
        });
    }

    @Post('/ckeditor/list')
    public async listFromCKEditor(): Promise<{ name: string, path: string, min: string }[]> {
        return this._imageResizeServie.getCKEditorFiles();
    }

}
