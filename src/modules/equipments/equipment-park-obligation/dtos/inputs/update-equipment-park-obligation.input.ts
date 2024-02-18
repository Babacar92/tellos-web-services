// NestJs
import { Field, Float, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas

//Constraints
import { ObligationTypeEnum } from '../../../enums/obligation-type.enum';
import { ObligationTriggerUnitEnum } from '../../../enums/obligation-trigger-unit.enum';
import { ObligationTypeExistConstraint } from '@/modules/obligation-type/constraints/obligation-type.exist.constraint';
import { ObligationType } from '@/entities/psql/obligation-type.entity';

@InputType()
export class UpdateEquipmentParkObligationInput {
    @IsNumber()
    @Field((type) => Int)
    id!: number;

    @IsOptional()
    @Field((type) => ObligationTypeEnum)
    @IsEnum(ObligationTypeEnum)
    type?: ObligationTypeEnum;

    @IsOptional()
    @Field((type) => Int, { nullable: true })
    @Validate(ObligationTypeExistConstraint, {})
    @Transform(({ value }) => ObligationType.init(value))
    label?: ObligationType;

    @IsOptional()
    @Field((type) => Float, { nullable: true })
    @IsNumber()
    periodicity?: number;

    @IsOptional()
    @IsEnum(ObligationTriggerUnitEnum)
    @Field((type) => ObligationTriggerUnitEnum, { nullable: true })
    triggerUnit?: ObligationTriggerUnitEnum;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    maintenanceDuration?: number;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    documentRequired?: boolean;
}
