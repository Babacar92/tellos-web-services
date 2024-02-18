import { Module } from '@nestjs/common';
import { HtmlToPdfService } from './services/html-to-pdf.service';
import { HtmlToPdfController } from './controllers/html-to-pdf.controller';

/**
 * Html To Pdf Module
 */
@Module({
    imports: [],
    providers: [HtmlToPdfService],
    exports: [HtmlToPdfService],
    controllers: [HtmlToPdfController],
})
export class HtmlToPdfModule {}
