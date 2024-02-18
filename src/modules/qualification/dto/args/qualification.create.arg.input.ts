import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { QualificationNameEntity } from 'src/entities/psql/QualificationNameEntity';
import { QualificationTypeEntity } from 'src/entities/psql/QualificationTypeEntity';
import { QualificationNameExistConstraint } from 'src/modules/qualification-name/constraints/qualification-name.exist.constraint';
import { QualificationTypeExistConstraint } from 'src/modules/qualification-type/constraints/qualification-type.exist.constraint';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { DepartmentEntity } from 'src/entities/psql/DepartmentEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { QualificationNotExistByColumnConstraint } from '../../constraints/qualification.not.exist.by.column.constraints';
import { QualificationStatusEnum } from '../enums/qualification.status.enum';

/**
 * Input for to create a new Quick Access
 */
export class QualificationCreateArgInput {
    /**
     * The employee of Qualification
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * The name of Qualification
     */
    @Validate(QualificationNameExistConstraint, {})
    @Transform(({ value }) => QualificationNameEntity.init(value))
    public name: QualificationNameEntity;

    /**
     * The type of Qualification
     */
    @Validate(QualificationTypeExistConstraint, {})
    @Transform(({ value }) => QualificationTypeEntity.init(value))
    public type: QualificationTypeEntity;

    /**
     * The date of Qualification
     */
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public delivery: Date;

    /**
     * Number of Quaficiation
     */
    @IsString()
    @Validate(QualificationNotExistByColumnConstraint, {})
    public number?: string;

    /**
     * Uploaded Icon
     */
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc'],
    })
    public document: GraphqlFileUpload;

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
    public status: QualificationStatusEnum = QualificationStatusEnum.VALIDATED;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active = true;

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
