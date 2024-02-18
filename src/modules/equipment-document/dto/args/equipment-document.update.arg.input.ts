import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { EquipmentDocumentExistConstraint } from '../../constraints/equipment-document.exist.constraint';
import { Transform } from 'class-transformer';
import { EquipmentDocumentCheckStartAndEndDateConstraint } from '../../constraints/equipment.check.start.and.end.date.constraint';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { DocumentTypeEntity } from 'src/entities/psql/DocumentTypeEntity';
import { DocumentTypeExistConstraint } from 'src/modules/document-type/constraints/document-type.exist.constraint';

/**
 * Input for to update a new EquipmentDocument
 */
export class EquipmentDocumentUpdateArgInput {
    /**
     * The id of EquipmentDocumentType
     */
    @IsNotEmpty()
    @Validate(EquipmentDocumentExistConstraint, {})
    public id: number;

    /**
     * The title of EquipmentDocumentType
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * Description of equipment document
     */
    @IsOptional()
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
    @IsOptional()
    @Validate(DocumentTypeExistConstraint, {})
    @Transform(({ value }) => DocumentTypeEntity.init(value))
    public documentType?: DocumentTypeEntity;

    /**
     * Start date of equipment document
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
     * End date equipment document
     */
    @IsOptional()
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
    public active?: boolean;
}
