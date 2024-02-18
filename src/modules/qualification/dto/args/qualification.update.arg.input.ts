import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { QualificationExistConstraint } from '../../constraints/qualification.exist.constraint';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import { QualificationTypeEntity } from 'src/entities/psql/QualificationTypeEntity';
import { Transform } from 'class-transformer';
import { QualificationTypeExistConstraint } from 'src/modules/qualification-type/constraints/qualification-type.exist.constraint';
import { QualificationNameEntity } from 'src/entities/psql/QualificationNameEntity';
import { QualificationNameExistConstraint } from 'src/modules/qualification-name/constraints/qualification-name.exist.constraint';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { DepartmentEntity } from 'src/entities/psql/DepartmentEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { QualificationNotExistByColumnConstraint } from '../../constraints/qualification.not.exist.by.column.constraints';
import { QualificationStatusEnum } from '../enums/qualification.status.enum';

/**
 * Input for to update a new Quick Access
 */
export class QualificationUpdateArgInput {
    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(QualificationExistConstraint, {})
    public id: number;

    /**
     * The employee of Qualification
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * The name of Qualification
     */
    @IsOptional()
    @Validate(QualificationNameExistConstraint, {})
    @Transform(({ value }) => QualificationNameEntity.init(value))
    public name?: QualificationNameEntity;

    /**
     * The type of Qualification
     */
    @IsOptional()
    @Validate(QualificationTypeExistConstraint, {})
    @Transform(({ value }) => QualificationTypeEntity.init(value))
    public type?: QualificationTypeEntity;

    /**
     * The date of Qualification
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public delivery?: Date;

    /**
     * Number of Quaficiation
     */
    @IsOptional()
    @IsString()
    @Validate(QualificationNotExistByColumnConstraint, {})
    public number?: string;

    /**
     * Uploaded Icon
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc'],
    })
    public document?: GraphqlFileUpload;

    /**
     * The document name of qualification
     */
    @IsOptional()
    @IsString()
    @Validate(QualificationNotExistByColumnConstraint, {})
    public documentName?: string;

    /**
     * Comment of qualification
     */
    @IsOptional()
    @IsString()
    public comment?: string;

    /**
     * Comment of fromMyAccount
     */
    @IsOptional()
    @IsBoolean()
    public fromMyAccount?: boolean;

    /**
     * Comment of status
     */
    @IsOptional()
    @IsEnum(QualificationStatusEnum)
    public status?: QualificationStatusEnum;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

    /**
     * Entity of Employee of Qualification
     */
    public entity?: EntityEntity;

    /**
     * Department of Employee of Qualification
     */
    public department?: DepartmentEntity;

    /**
     * Validity of Qualification
     */
    public validity?: number;

    /**
     * Deadline of Qualification
     */
    public deadline?: Date;
}
