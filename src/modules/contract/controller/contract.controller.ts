import {
    Controller,
    Get,
    Header,
    Param,
    ParseIntPipe,
    Res,
    StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ContractService } from '../service/contract.service';
import {
    HTML2PDF_UPLOAD_DIRNAME,
    HtmlToPdfService,
} from 'src/libs/html-to-pdf/services/html-to-pdf.service';
import * as fs from 'fs';
import { FileDataType, fileData } from '../../../utils/upload.utils';

@Controller('contract')
export class ContractController {
    public constructor(
        private readonly _service: ContractService,
        private readonly _htmlToPdfService: HtmlToPdfService,
    ) {}

    @Get('/download/:contract')
    @Header('Cache-Control', 'none')
    public async download(
        @Res({ passthrough: true })
        res: Response,
        @Param('contract', ParseIntPipe)
        contract: number,
    ): Promise<StreamableFile> {
        return new Promise<StreamableFile>(async (resolve, reject) => {
            const contractFound = await this._service.findOne(contract);
            let fullPath: string;

            if (contractFound && contractFound.text) {
                if (!contractFound.isSigned) {
                    if (!contractFound.filename) {
                        contractFound.generateNameIfnotExists();

                        const res = await this._service.update({
                            id: contractFound.id,
                            filename: contractFound.filename,
                        });
                    }

                    const data = await this._htmlToPdfService.fromContent(
                        contractFound.text,
                        contractFound.shortpath,
                    );

                    if (!(<any>data).success)
                        fullPath = (<FileDataType>data).fullPath;
                } else {
                    fullPath = `${HTML2PDF_UPLOAD_DIRNAME}/${contractFound.shortpath}`;
                }

                if (fullPath) {
                    const file = fs.createReadStream(fullPath);

                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename="${contractFound.filename}"`,
                    });

                    return resolve(new StreamableFile(file));
                }
            }

            resolve(null);
        });
    }

    @Get('/show/:contract')
    @Header('Cache-Control', 'none')
    public async show(
        @Res({ passthrough: true })
        res: Response,
        @Param('contract', ParseIntPipe)
        contract: number,
    ): Promise<StreamableFile> {
        return new Promise<StreamableFile>(async (resolve, reject) => {
            const contractFound = await this._service.findOne(contract);

            if (contractFound && contractFound.filename) {
                const data = fileData(
                    `${HTML2PDF_UPLOAD_DIRNAME}/${contractFound.shortpath}`,
                );

                if (data) {
                    const file = fs.createReadStream((<any>data).fullPath);

                    res.set({
                        'Content-Type': 'application/pdf',
                    });

                    return resolve(new StreamableFile(file));
                }
            }

            resolve(null);
        });
    }

    @Get(':id/sign')
    public async signature(@Param('id') id: number): Promise<void> {
        const contrat = await this._service.findOne(id);

        if (!contrat) {
            throw new Error('Contrat not found');
        }

        const yousignSignatureRequest = await this._service.signatureRequest();

        const result = await this._service.update({
            id: contrat.id,
            youSignSignatureRequestId: yousignSignatureRequest.id,
        });

        const filename = `contract-${contrat.id}.pdf`;

        const uploadDocument = await this._service.uploadDocument(
            yousignSignatureRequest.id,
            filename,
        );

        await this._service.update({
            id: contrat.id,
            youSignDocumentId: uploadDocument.data.id,
        });

        const signerId = await this._service.addSigner(
            yousignSignatureRequest.id,
            uploadDocument?.data?.id,
            contrat.employee.emailPro,
            contrat.employee.firstname,
            contrat.employee.lastname,
        );

        await this._service.update({
            id: contrat.id,
            youSignTargetUserToSignId: signerId.id,
        });

        await this._service.activateSignatureRequest(
            yousignSignatureRequest.id,
        );
    }
}
