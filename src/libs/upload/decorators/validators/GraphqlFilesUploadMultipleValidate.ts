import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import {
    FILE_UPLOAD_VALIDATION_ERROR_CODE,
    validateFileUploadValue,
    validationFileUploadMessagesMap,
} from './GraphqlFileUploadValidate';

/**
 * The option for validation
 */
export declare type GraphqlFilesUploadMultipleOptions = {
    total?: number;
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
export const GraphqlFilesUploadMultipleValidate = (
    options?: GraphqlFilesUploadMultipleOptions,
    validationsOptions?: ValidationOptions,
): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        const { total, extension, mimetype, sizeMin, sizeMax } = <
            GraphqlFilesUploadMultipleOptions
        >Object.assign(
            {
                total: 20,
                extension: '*',
                mimetype: '*',
            },
            options || {},
        );

        let resultsValidation: {
            resultValidation: FILE_UPLOAD_VALIDATION_ERROR_CODE;
            filename?: string;
            index?: number | string;
        }[];

        registerDecorator({
            name: 'GRAPHQL_FILES_UPLOAD_MULTIPLE_VALIDATOR',
            target: object.constructor,
            propertyName: propertyName,
            options: validationsOptions,
            constraints: [],
            validator: {
                async validate(value: GraphqlFileUpload[] | undefined, args) {
                    // Init list error
                    resultsValidation = [];

                    // Check if is array
                    if (!value)
                        resultsValidation.push({
                            resultValidation:
                                FILE_UPLOAD_VALIDATION_ERROR_CODE.UNDIFINED,
                        });
                    // Check if is list
                    else if (!(value instanceof Array))
                        resultsValidation.push({
                            resultValidation:
                                FILE_UPLOAD_VALIDATION_ERROR_CODE.IS_NOT_LIST,
                        });
                    // Check the length
                    else if (value.length > total)
                        resultsValidation.push({
                            resultValidation:
                                FILE_UPLOAD_VALIDATION_ERROR_CODE.LIST_LENGTH,
                        });

                    // Check all files
                    for (let i in value) {
                        const upload: GraphqlFileUpload = value[i];

                        const resultValidation = await validateFileUploadValue(
                            upload,
                            extension,
                            mimetype,
                            sizeMin,
                            sizeMax,
                        );

                        const filename = (await upload?.promise)?.filename;

                        if (
                            resultValidation !==
                            FILE_UPLOAD_VALIDATION_ERROR_CODE.SUCCESS
                        ) {
                            resultsValidation.push({
                                resultValidation: resultValidation,
                                filename: filename,
                                index: i,
                            });
                        }
                    }

                    return resultsValidation.length === 0;
                },
                // defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is not a valid uploaded file', validationsOptions),
                defaultMessage: (validationArgs: ValidationArguments) => {
                    const messages: string[] = [];

                    for (const i in resultsValidation) {
                        const value = resultsValidation[i];

                        messages.push(
                            validationFileUploadMessagesMap.get(
                                value.resultValidation,
                            )(validationArgs.property, {
                                filename: value.filename,
                                extension,
                                mimetype,
                                sizeMin,
                                sizeMax,
                                total,
                            }),
                        );
                    }

                    return messages.join('\n');
                },
            },
        });
    };
};
