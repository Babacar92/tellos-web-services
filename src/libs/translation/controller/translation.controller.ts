import { Controller, Get, Header, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { TranslationService } from '../service/translation.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

/**
 * Translation Controller
 */
@UseGuards(
    LoginUserPermissionGuard)
@Controller('translation')
export class TranslationController {

    public constructor(
        private readonly _service: TranslationService,
    ) { }

    /**
     * Import texts and save change
     * @param file 
     * @returns 
     */
    @Post('/import')
    @Header('Cache-Control', 'none')
    @UseInterceptors(FileInterceptor('file'))
    public async import(
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<{ success: boolean }> {
        return this._service.importFromUpload(file);
    }

    /**
     * Export saved texts
     * @param res 
     * @param type 
     * @returns 
     */
    @Get('/export/:type')
    @Header('Cache-Control', 'none')
    public async export(
        @Res({ passthrough: true })
        res: Response,
        @Param('type')
        type: string,
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let contentType = 'plain/text; charset=utf-8',
                response = 'No text found',
                filename = '';

            if (type.match(/^json$/i)) {
                response = await this._service.toJson();
                contentType = 'application/json; charset=utf-8';
                filename = 'translations.json';
            } else if (type.match(/^csv$/i)) {
                response = await this._service.toCsv();
                filename = 'translations.csv';
            }

            res.set({ 'Content-Type': contentType });

            if (filename) res.set({ 'Content-Disposition': `attachment; filename="${filename}"` });

            resolve(response);
        });
    }

}
