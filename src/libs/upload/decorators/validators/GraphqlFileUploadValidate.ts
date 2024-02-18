import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import { ReadStream } from 'fs';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { dump } from 'src/utils/utils';

/**
 * The error validation code for file upload
 */
export enum FILE_UPLOAD_VALIDATION_ERROR_CODE {
    SUCCESS,
    UNDIFINED,
    NOT_INSTANCE,
    HAS_NOT_EXTENSION,
    HAS_NOT_MIMETYPE,
    SIZE_MIN,
    SIZE_MAX,
    IS_NOT_LIST,
    LIST_LENGTH,
    ERROR_ON_LOAD,
}

/**
 * The option for validation
 */
export declare type GraphqlFileUploadOptions = {
    extension?: string | string[];
    mimetype?: string | string[];
    sizeMin?: number;
    sizeMax?: number;
};

/**
 * The graphql upload type
 * @param options
 * @param validationsOptions
 * @returns
 */
export const GraphqlFileUploadValidate = (
    options?: GraphqlFileUploadOptions,
    validationsOptions?: ValidationOptions,
): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        const { extension, mimetype, sizeMin, sizeMax } = <
            GraphqlFileUploadOptions
        >Object.assign(
            {
                extension: '*',
                mimetype: '*',
            },
            options || {},
        );

        let resultValidation: FILE_UPLOAD_VALIDATION_ERROR_CODE,
            filename: string;

        registerDecorator({
            name: 'FILE_UPLOAD_GQL_VALIDATOR',
            target: object.constructor,
            propertyName: propertyName,
            options: validationsOptions,
            constraints: [],
            validator: {
                async validate(value: GraphqlFileUpload | undefined, args) {
                    resultValidation = await validateFileUploadValue(
                        value,
                        extension,
                        mimetype,
                        sizeMin,
                        sizeMax,
                    );

                    filename = (await value?.promise)?.filename;

                    return (
                        resultValidation ===
                        FILE_UPLOAD_VALIDATION_ERROR_CODE.SUCCESS
                    );
                },
                // defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is not a valid uploaded file', validationsOptions),
                defaultMessage: (validationArgs: ValidationArguments) => {
                    return validationFileUploadMessagesMap.get(
                        resultValidation,
                    )(validationArgs.property, {
                        filename,
                        extension,
                        mimetype,
                        sizeMin,
                        sizeMax,
                    });
                },
            },
        });
    };
};

/**
 * Check validation of value
 * @param value
 * @param extension
 * @param mimetype
 * @param sizeMin
 * @param sizeMax
 * @returns
 */
export const validateFileUploadValue = async (
    value: GraphqlFileUpload | undefined,
    extension?: string | string[],
    mimetype?: string | string[],
    sizeMin?: number,
    sizeMax?: number,
): Promise<FILE_UPLOAD_VALIDATION_ERROR_CODE> => {
    return new Promise(async (resolve, reject) => {
        let response: FILE_UPLOAD_VALIDATION_ERROR_CODE;

        // Check if value is defined
        if (!value) {
            resolve(FILE_UPLOAD_VALIDATION_ERROR_CODE.UNDIFINED);
            return;
        }

        // Check if file upload is an instance of GraphqlFileUpload
        else if (!(value instanceof GraphqlFileUpload)) {
            resolve(FILE_UPLOAD_VALIDATION_ERROR_CODE.NOT_INSTANCE);
            return;
        }

        // Extract file infos
        const fileData = await value.promise;

        // Check if has extension string
        if (
            typeof extension === 'string' &&
            extension !== '*' &&
            !fileData.filename.match(new RegExp(`\.${extension}$`, 'i'))
        )
            response = FILE_UPLOAD_VALIDATION_ERROR_CODE.HAS_NOT_EXTENSION;
        // Check if has extension in string list
        else if (
            extension instanceof Array &&
            !extension.find((v) =>
                fileData.filename.match(new RegExp(`\.${v}$`, 'i')),
            )
        )
            response = FILE_UPLOAD_VALIDATION_ERROR_CODE.HAS_NOT_EXTENSION;
        // Check if has mimetype string
        else if (
            typeof mimetype === 'string' &&
            mimetype !== '*' &&
            !fileData.mimetype.match(new RegExp(`^${mimetype}$`, 'i'))
        )
            response = FILE_UPLOAD_VALIDATION_ERROR_CODE.HAS_NOT_MIMETYPE;
        // Check if has mimetype in string list
        else if (
            mimetype instanceof Array &&
            !mimetype.find((v) =>
                fileData.mimetype.match(new RegExp(`^${v}$`, 'i')),
            )
        )
            response = FILE_UPLOAD_VALIDATION_ERROR_CODE.HAS_NOT_MIMETYPE;

        if (response) {
            resolve(response);

            return;
        } else {
            const read: ReadStream = await fileData.createReadStream();

            let size = 0;

            read.on('data', (c) => (size += c.length));

            read.on('end', () => {
                // Error on min size
                if (sizeMin && sizeMin > size)
                    resolve(FILE_UPLOAD_VALIDATION_ERROR_CODE.SIZE_MIN);
                // Error on min size
                else if (sizeMax && sizeMax < size)
                    resolve(FILE_UPLOAD_VALIDATION_ERROR_CODE.SIZE_MAX);
                // Is Success
                else resolve(FILE_UPLOAD_VALIDATION_ERROR_CODE.SUCCESS);

                read.destroy();
            });

            read.on('error', (err) => {
                dump(err.message);
                resolve(FILE_UPLOAD_VALIDATION_ERROR_CODE.ERROR_ON_LOAD);

                read.destroy();
            });
        }
    });
};

/**
 * The map for error validation message
 */
export const validationFileUploadMessagesMap = new Map([
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.UNDIFINED,
        (property: string, data: any) =>
            `The property ${property} is not defined`,
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.NOT_INSTANCE,
        (property: string, data: any) =>
            `The value of ${property} is not valid`,
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.HAS_NOT_EXTENSION,
        (property: string, { filename, extension }: any) => {
            if (extension instanceof Array)
                extension = extension.map((v) => `.${v}`).join(', ');
            return `The file ${filename} has not exension(s) (${extension}) for property ${property}`;
        },
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.HAS_NOT_MIMETYPE,
        (property: string, { filename, mimetype }: any) => {
            if (mimetype instanceof Array) mimetype = mimetype.join(', ');
            return `The file ${filename} has not mimetype(s) (${mimetype}) for property ${property}`;
        },
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.SIZE_MIN,
        (property: string, data: any) =>
            `The file of ${property} is not big enough`,
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.SIZE_MAX,
        (property: string, data: any) => `The file of ${property} is too big`,
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.IS_NOT_LIST,
        (property: string, { total }: any) => {
            return `The value of ${property} is not a list`;
        },
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.LIST_LENGTH,
        (property: string, { total }: any) => {
            return `You can't upload more than ${total} files`;
        },
    ],
    [
        FILE_UPLOAD_VALIDATION_ERROR_CODE.ERROR_ON_LOAD,
        (property: string, { filename }: any) => {
            return `An error on server when load file ${filename}`;
        },
    ],
]);
