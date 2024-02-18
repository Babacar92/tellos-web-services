// NestJs
import { Field, Float, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';

//Utils
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';

//Enums

//Validators

//Schemas
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EntityEntity } from 'src/entities/psql/EntityEntity';

//Constraints
import { CategoryEquipmentExistConstraint } from 'src/modules/category-equipment/constraints/category-equipment.exist.constraint';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { GraphqlFilesUploadMultipleValidate } from '@/libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate';
import { EquipmentTypeEnum } from '../../enums/equipment.type.enum';
import { EquipmentParkWorkUnitTypeEnum } from '../../enums/equipment-park-work-unit-type.enum';
import { MediumSizedCentreEntity } from '@/entities/psql/MediumSizedCentreEntity';
import { MediumSizedCentreExistConstraint } from '@/modules/medium-sized-centre/constraints/medium-sized-centre.exist.constraint';

@InputType()
export class UpdateEquipmentParkInput {
    @IsNumber()
    @Field((type) => Int)
    id!: number;

    @IsOptional()
    @IsString()
    @Field()
    denomination?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    registrationNumber?: string;

    @IsOptional()
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    @Field((type) => Int)
    entity?: EntityEntity;

    @IsOptional()
    @Validate(CategoryEquipmentExistConstraint, {})
    @Transform(({ value }) => CategoryEquipment.init(value))
    @Field((type) => Int)
    category?: CategoryEquipment;

    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    @IsOptional()
    pictures: number[];

    @IsOptional()
    @GraphqlFilesUploadMultipleValidate({
        extension: ['pdf', 'png', 'docx', 'doc', 'jpeg', 'jpg'],
    })
    newPictures: GraphqlFileUpload[];

    @IsOptional()
    @IsEnum(EquipmentTypeEnum)
    @Field()
    type?: EquipmentTypeEnum;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    orderNumber?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    orderDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    deliveryDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    firstCirculation?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    registrationDate?: Date;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    originalValue?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    counter?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    standardCost?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    co2Emission?: number;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    active?: boolean;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    available?: boolean;

    @IsOptional()
    @IsEnum(EquipmentParkWorkUnitTypeEnum)
    @Field((type) => EquipmentParkWorkUnitTypeEnum, { nullable: true })
    unitOfWork?: EquipmentParkWorkUnitTypeEnum;

    @IsOptional()
    @Validate(MediumSizedCentreExistConstraint, {})
    @Transform(({ value }) => MediumSizedCentreEntity.init(value))
    @Field((type) => Int, { nullable: true })
    center?: MediumSizedCentreEntity;
}
