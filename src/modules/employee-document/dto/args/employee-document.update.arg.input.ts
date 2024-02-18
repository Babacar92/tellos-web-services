import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    Validate,
} from 'class-validator';
import { EmployeeDocumentExistConstraint } from '../../constraints/employee-document.exist.constraint';
import { EMPLOYEE_DOCUMENT_STATUS } from '../enums/employee-document.status.enum';
import { Transform } from 'class-transformer';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { DocumentTypeExistConstraint } from 'src/modules/document-type/constraints/document-type.exist.constraint';
import { DocumentTypeEntity } from 'src/entities/psql/DocumentTypeEntity';

/**
 * Input for to update a new Quick Access
 */
export class EmployeeDocumentUpdateArgInput {
    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(EmployeeDocumentExistConstraint, {})
    public id: number;

    /**
     * Type of EmployeeDocument
     */
    @Validate(DocumentTypeExistConstraint, {})
    @IsOptional()
    @Transform(({ value }) => DocumentTypeEntity.init(value))
    public type?: DocumentTypeEntity;

    /**
     * Employe of employeedocument
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFileUploadValidate({})
    public file?: GraphqlFileUpload;

    /**
     * Validate date of employeedocument
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public validateDate?: Date;

    /**
     * Dunning date of employeedocument
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dunningDate?: Date;

    /**
     * Signed date of employeedocument
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public signedDate?: Date;

    /**
     * Status of EmployeeDocument
     */
    @IsOptional()
    @IsEnum(EMPLOYEE_DOCUMENT_STATUS)
    public status?: EMPLOYEE_DOCUMENT_STATUS;

    /**
     * Require the employee signature
     */
    @IsOptional()
    @IsBoolean()
    public requireEmployeeSignature?: boolean;

    /**
     * Require the employee file
     */
    @IsOptional()
    @IsBoolean()
    public requireEmployeeUpload?: boolean;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
