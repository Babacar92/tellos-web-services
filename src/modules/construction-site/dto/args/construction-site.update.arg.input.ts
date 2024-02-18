import {
    Validate,
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsDate,
    IsEnum,
} from 'class-validator';
import { ConstructionSiteExistConstraint } from '../../constraints/construction-site.exist.constraint';
import { Field, Int } from '@nestjs/graphql';
import { Employee } from '@/entities/psql/EmployeeEntity';
import { ConstructionSiteStatusEnum } from '../../enums/construction-site-status.enum';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';
import { ConstructionSiteTypeEnum } from '../../enums/construction-site-type.enum';
import { Transform } from 'class-transformer';
import { Optional } from '@nestjs/common';
import { EmployeeExistConstraint } from '@/modules/employee/constraints/employee.exist.constraint';

/**
 * Input for to update a new equipment technical thumbnail
 */
export class ConstructionSiteUpdateArgInput {
    @IsNumber()
    @Field((type) => Int)
    id!: number;

    @IsOptional()
    @IsEnum(ConstructionSiteTypeEnum)
    @Field((type) => ConstructionSiteTypeEnum)
    type?: ConstructionSiteTypeEnum;

    @IsOptional()
    @Field((type) => Int)
    @Validate(ConstructionSiteExistConstraint, {})
    @Transform(({ value }) => ConstructionSite.init(value))
    from?: ConstructionSite;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    label?: string;

    @Optional()
    @IsString()
    @Field({ nullable: true })
    place?: string;

    @Optional()
    @IsString()
    @Field({ nullable: true })
    nature?: string;

    @IsOptional()
    @Validate(ConstructionSiteExistConstraint, {})
    @Transform(({ value }) => ConstructionSite.init(value))
    @Field(() => Int)
    entity?: EntityEntity;

    @IsOptional()
    @IsBoolean()
    @Field()
    submittedToGeneralFees?: boolean;

    @IsOptional()
    @IsBoolean()
    @Field()
    constructionForecast?: boolean;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int)
    commands?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int)
    incomes?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int)
    expenses?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int)
    billings?: number;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field({ nullable: true })
    openingCaseDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field()
    endDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field()
    ClosingDate?: Date;

    @IsOptional()
    @IsEnum(ConstructionSiteStatusEnum)
    @Field((type) => ConstructionSiteStatusEnum, { nullable: true })
    status?: ConstructionSiteStatusEnum;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field()
    dictDate?: Date;

    @IsOptional()
    @IsString()
    @Field()
    dictReference?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field({ nullable: true })
    circulationDate?: Date;

    @IsOptional()
    @Field()
    @IsString()
    circulationRef?: string;

    @IsOptional()
    @Field((type) => Int)
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    riskFrom?: Employee;

    @IsOptional()
    @IsString()
    @Field()
    riskComment?: string;
}
