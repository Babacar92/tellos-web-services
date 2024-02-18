import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { GraphqlFilesUploadMultipleValidate } from '../../../../libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate';

/**
 * Input for to create a new EmployeeDisciplinary
 */
export class EmployeeDisciplinaryCreateArgInput {
    /**
     * comment EmployeeDisciplinary
     */
    @IsString()
    public comment?: string;

    /**
     * The files of EmployeeDisciplinary
     */
    @IsOptional()
    @GraphqlFilesUploadMultipleValidate({
        extension: ['pdf', 'png', 'docx', 'doc'],
    })
    public files?: GraphqlFileUpload[];

    /**
     * The employee of Employee Disciplinary
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;
}
