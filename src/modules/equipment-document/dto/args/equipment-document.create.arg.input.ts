import {
    IsBoolean,
    IsDate,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { Transform } from 'class-transformer';
import { EquipmentDocumentCheckStartAndEndDateConstraint } from '../../constraints/equipment.check.start.and.end.date.constraint';
import { DocumentTypeExistConstraint } from 'src/modules/document-type/constraints/document-type.exist.constraint';
import { DocumentTypeEntity } from 'src/entities/psql/DocumentTypeEntity';

/**
 * Input for to create a new Equipment Document
 */
export class EquipmentDocumentCreateArgInput {
    /**
     * Title of equipment document
     */
    @IsString()
    public title?: string;

    /**
     * Description of equipment document
     */
    @IsString()
    public description?: string;

    /**
     * The employee of equipment document
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * The document type of equipment document
     */
    @Validate(DocumentTypeExistConstraint, {})
    @Transform(({ value }) => DocumentTypeEntity.init(value))
    public documentType?: DocumentTypeEntity;

    /**
     * Start date of equipment document
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
     * End date equipment document
     */
    @IsDate()
    @Validate(EquipmentDocumentCheckStartAndEndDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;
}
