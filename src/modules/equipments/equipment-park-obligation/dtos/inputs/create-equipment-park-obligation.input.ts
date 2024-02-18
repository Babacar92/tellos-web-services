// NestJs
import { Field, Float, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas

//Constraints
import { EquipmentParkExistConstraint } from '../../../equipment-park/equipment-park.exist.constraint';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { ObligationTriggerUnitEnum } from '../../../enums/obligation-trigger-unit.enum';
import { CategoryEquipmentExistConstraint } from '@/modules/category-equipment/constraints/category-equipment.exist.constraint';
import { CategoryEquipment } from '@/entities/psql/CategoryEquipmentEntity';
import { ObligationTypeEnum } from '../../../enums/obligation-type.enum';
import { ObligationType } from '@/entities/psql/obligation-type.entity';
import { ObligationTypeExistConstraint } from '@/modules/obligation-type/constraints/obligation-type.exist.constraint';

@InputType()
export class CreateEquipmentParkObligationInput {
    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    equipmentPark?: EquipmentPark;

    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(CategoryEquipmentExistConstraint, {})
    @Transform(({ value }) => CategoryEquipment.init(value))
    category?: CategoryEquipment;

    @Field((type) => ObligationTypeEnum)
    @IsEnum(ObligationTypeEnum)
    type!: ObligationTypeEnum;

    @Field((type) => Int)
    @Validate(ObligationTypeExistConstraint, {})
    @Transform(({ value }) => ObligationType.init(value))
    label!: ObligationType;

    @Field((type) => Float)
    @IsNumber()
    periodicity!: number;

    @IsEnum(ObligationTriggerUnitEnum)
    @Field((type) => ObligationTriggerUnitEnum)
    triggerUnit!: ObligationTriggerUnitEnum;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    maintenanceDuration?: number;

    @IsBoolean()
    @Field()
    documentRequired!: boolean;
}
