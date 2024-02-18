import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { EquipmentNotExistByColumnConstraint } from '../../constraints/equipment.not.exist.by.column.constraints';
import { EquipmentExistConstraint } from '../../constraints/equipment.exist.constraint';
import { TypeEnum } from '../enums/equipment.type.enum';
import { Transform } from 'class-transformer';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { AvailableEnum } from '../enums/equipment.available.enum';
import { EquipmentCheckStartAndEndDateConstraint } from '../../constraints/equipment.check.start.and.end.date.constraint';
import { EquipmentCheckOrderAndDeliveryDateConstraint } from '../../constraints/equipment.check.order.and.delivery.date.constraint';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { CategoryEquipmentExistConstraint } from 'src/modules/category-equipment/constraints/category-equipment.exist.constraint';

/**
 * Input for to update Equipment
 */
export class EquipmentUpdateArgInput {
    /**
     * The id of Career Path
     */
    @IsNotEmpty()
    @Validate(EquipmentExistConstraint, {})
    public id: number;
    /**
     * The denomination of Equipment
     */
    @IsOptional()
    @IsString()
    public denomination?: string;

    /**
     * The registrationNumber of Equipment
     */
    @IsOptional()
    @IsString()
    public registrationNumber?: string;

    /**
     * The orderNumber of Equipment
     */
    @IsOptional()
    @IsString()
    public orderNumber?: string;

    /**
     * type of Equipment
     */
    @IsOptional()
    @IsString()
    @IsEnum(TypeEnum)
    @Transform(({ value }) => (value ? value : null))
    public type?: string;

    /**
     * available of Equipment
     */
    @IsOptional()
    @IsString()
    @IsEnum(AvailableEnum)
    @Transform(({ value }) => (value ? value : null))
    public available?: string;

    /**
     * Start date of Equipment
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
    @Validate(EquipmentCheckStartAndEndDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * order date of Equipment
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public orderDate?: Date;

    /**
     * delivery date of Equipment
     */
    @IsOptional()
    @IsDate()
    @Validate(EquipmentCheckOrderAndDeliveryDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public deliveryDate?: Date;

    /**
     * firstCirculation date of Equipment
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public firstCirculation?: Date;

    /**
     * registrationDate date of Equipment
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public registrationDate?: Date;

    /**
     * original Value of Equipment
     */
    @IsOptional()
    @IsNumber()
    public originalValue?: number;

    /**
     * counter of Equipment
     */
    @IsOptional()
    @IsNumber()
    public counter?: number;

    /**
     * standard Cost of Equipment
     */
    @IsOptional()
    @IsNumber()
    public standardCost?: number;

    /**
     * co2Emissions of Equipment
     */
    @IsOptional()
    @IsNumber()
    public co2Emissions?: number;

    /**
     * The photo of Equipment
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc'],
    })
    public photo?: GraphqlFileUpload;

    /**
     * The photo name of Equipment
     */
    @IsOptional()
    @IsString()
    @Validate(EquipmentNotExistByColumnConstraint, {})
    public photoName?: string;

    /**
     * The employee of equipment
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * The entity of equipment
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * The categorie of Equipment
     */
    @IsOptional()
    @Validate(CategoryEquipmentExistConstraint, {})
    @Transform(({ value }) => CategoryEquipment.init(value))
    public categorie?: CategoryEquipment;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
