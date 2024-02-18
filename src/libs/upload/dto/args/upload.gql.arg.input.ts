import { GraphqlFilesUploadMultipleValidate } from '../../decorators/validators/GraphqlFilesUploadMultipleValidate';
import { GraphqlFileUploadValidate } from '../../decorators/validators/GraphqlFileUploadValidate';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';

/**
 * The input arg for upload file
 */
export class UploadGqlFileArgInput {

    /**
     * The uploaded file
     */
    @GraphqlFileUploadValidate()
    public file: GraphqlFileUpload;
}

/**
 * The input arg for upload file
 */
export class UploadMultipleGqlFileArgInput {

    /**
     * The uploaded file
     */
    @GraphqlFilesUploadMultipleValidate()
    public files: GraphqlFileUpload[];
}