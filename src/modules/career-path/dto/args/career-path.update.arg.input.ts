import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { CareerPathNotExistByColumnConstraint } from '../../constraints/career-path.not.exist.by.column.constraints';
import { CareerPathExistConstraint } from '../../constraints/career-path.exist.constraint';
import { CAREER_ICON_PATH } from '../enums/career-path.icon.enum';
import { Transform } from 'class-transformer';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { CareerPathCheckStartAndEndDateConstraint } from '../../constraints/career-path.check.start.and.end.date.constraint';

/**
 * Input for to update a new Career Path
 */
export class CareerPathUpdateArgInput {
    /**
     * The id of Career Path
     */
    @IsNotEmpty()
    @Validate(CareerPathExistConstraint, {})
    public id: number;

    /**
     * The title of Career Path
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * Icon of Career Path
     */
    @IsString()
    @IsOptional()
    @IsEnum(CAREER_ICON_PATH)
    @Transform(({ value }) => (value ? value : null))
    public icon?: string;

    /**
     * Start date of Career Path
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    /**
     * End date of Career Path
     */
    @IsOptional()
    @IsDate()
    @Validate(CareerPathCheckStartAndEndDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * Comment of Career Path
     */
    @IsString()
    @IsOptional()
    public comment?: string;

    /**
     * The file of Career Path
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc'],
    })
    public file?: GraphqlFileUpload;

    /**
     * The file name of Career Path
     */
    @IsOptional()
    @IsString()
    @Validate(CareerPathNotExistByColumnConstraint, {})
    public fileName?: string;

    /**
     * The employee of Career Path
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * Is editable
     */
    @IsOptional()
    @IsBoolean()
    public editable?: boolean;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean;
}
