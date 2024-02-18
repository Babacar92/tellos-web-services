import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { MedicalVisitNotExistByColumnConstraint } from '../../constraints/medical-visit.not.exist.by.column.constraints';
import { Transform } from 'class-transformer';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { MedicalVisitCheckStartAndEndDateConstraint } from '../../constraints/medical-visit.check.start.and.end.date.constraint';
import { MEDICAL_VISIT_STATUT } from '../enums/medical-visit.enum';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { DepartmentEntity } from 'src/entities/psql/DepartmentEntity';
import { DepartmentExistConstraint } from 'src/modules/department/constraints/department.exist.constraint';
import { MedicalVisitCheckLastAndNextDateConstraint } from '../../constraints/medical-visit.check.last.and.next.date.constraint';
import { EntityExistConstraint } from '../../../entity/constraints/entity.exist.constraint';
import { EntityEntity } from '../../../../entities/psql/EntityEntity';

/**
 * Input for to create a Medical Visit
 */
export class MedicalVisitCreateArgInput {
    /**
     * The job of Career
     */
    @IsString()
    public job?: string;

    /**
     * enity of Medical Visit
     */
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * contract of Medical Visit
     */
    @IsString()
    @IsOptional()
    @IsEnum(ContractEnum)
    @Transform(({ value }) => (value ? value : null))
    public contract?: string;

    /**
     * statut of Medical Visit
     */
    @IsString()
    @IsOptional()
    @IsEnum(MEDICAL_VISIT_STATUT)
    @Transform(({ value }) => (value ? value : null))
    public statut?: string;

    /**
     * Start date of Medical Visit
     */
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    /**
     * End date of Medical Visit
     */
    @IsOptional()
    @IsDate()
    @Validate(MedicalVisitCheckStartAndEndDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * last Date Medical Visit
     */
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public lastDateMedicalVisit?: Date;

    /**
     * next Date Medical Visit
     */
    @IsOptional()
    @IsDate()
    @Validate(MedicalVisitCheckLastAndNextDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public nextDateMedicalVisit?: Date;

    /**
     * place Of The Medicalvisit
     */
    @IsString()
    @IsOptional()
    public placeOfTheMedicalvisit?: string;

    /**
     * contraindication
     */
    @IsString()
    @IsOptional()
    public contraindication?: string;

    /**
     * The file Supporting
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc'],
    })
    public file?: GraphqlFileUpload;

    /**
     * The file name of Supporting
     */
    @IsOptional()
    @IsString()
    @Validate(MedicalVisitNotExistByColumnConstraint, {})
    public fileName?: string;

    /**
     * The employee of Medical Visit
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * The service of Medical Visit
     */
    @Validate(DepartmentExistConstraint, {})
    @Transform(({ value }) => DepartmentEntity.init(value))
    public service?: DepartmentEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;
}
