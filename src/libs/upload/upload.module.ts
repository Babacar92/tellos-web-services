import { Module } from "@nestjs/common";
import { DatabaseModule } from "../databases/databases.module";
import { UPLOAD_PROVIDERS } from "./provider/upload.provider";
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';
import { ImageResizeService } from './service/image.resize.service';
import { UploadImageResizeConstraint } from "./constraints/upload.image.resize.constrait";
import { UploadExistConstraint } from "./constraints/upload.exist.constraint";
import { TranslationModule } from "../translation/translation.module";
import { UploadResolver } from './resolver/upload.resolver';
import { UploadExistByColumnConstraint } from "./constraints/upload.exist.by.column.constraints";
import { UploadNotExistByColumnConstraint } from "./constraints/upload.not.exist.by.column.constraints";

/**
 * Upload Module
 */
@Module({
    imports: [
        DatabaseModule,
        TranslationModule,
    ],
    exports: [
        UploadService,
        ImageResizeService,
    ],
    providers: [
        ...UPLOAD_PROVIDERS,
        UploadService,
        ImageResizeService,
        UploadResolver,
        UploadExistConstraint,
        UploadExistByColumnConstraint,
        UploadNotExistByColumnConstraint,
        UploadImageResizeConstraint,
    ],
    controllers: [
        UploadController,
    ],
})
export class UploadModule {}