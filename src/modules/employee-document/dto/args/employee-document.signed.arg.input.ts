import { IsBoolean, IsOptional, Validate } from "class-validator";
import { EmployeeDocumentExistConstraint } from "../../constraints/employee-document.exist.constraint";
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { GraphqlFileUploadValidate } from "src/libs/upload/decorators/validators/GraphqlFileUploadValidate";

export class EmployeeDocumentSignedArgInput {

    /**
     * Id of Employee document
     */
    @Validate(EmployeeDocumentExistConstraint, {

    })
    public id: number;

    /**
     * Is signed
     */
    @IsBoolean()
    public signed: boolean;

    /**
     * The new signed file of employee document
     */
    @IsOptional()
    @GraphqlFileUploadValidate({

    })
    public file?: GraphqlFileUpload;

}