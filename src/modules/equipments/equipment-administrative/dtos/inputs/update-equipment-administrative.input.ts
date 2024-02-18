import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { ExitTypeEnum } from '../../../enums/exit-type.enum';
import { SellTypeEnum } from '../../../enums/sell-type.enum';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { Transform } from 'class-transformer';
import { EquipmentFundingExistConstraint } from 'src/modules/equipment-funding/constraints/equipment-funding.exist.constraint';

import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { CustomerEntity } from 'src/entities/psql/CustomerEntity';
import { CustomerExistConstraint } from 'src/modules/customer/constraints/customer.exist.constraint';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { OwnerEntityExistConstraint } from '@/modules/owner-entity/constraints/owner-entity.exist.constraint';

@InputType()
export class UpdateEquipmentAdministrativeInput {
    @Field((type) => Int)
    id!: number;

    @IsOptional()
    @Validate(OwnerEntityExistConstraint, {})
    @Transform(({ value }) => OwnerEntity.init(value))
    @Field((type) => Int, { nullable: true })
    ownerCompany?: OwnerEntity;

    @IsOptional()
    @Validate(EquipmentFundingExistConstraint, {})
    @Transform(({ value }) => EquipmentFunding.init(value))
    @Field((type) => Int, { nullable: true })
    funding?: EquipmentFunding;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    monthlyRent?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    maintenanceRent?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    maxAllowedKm?: number;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    contractStartDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    contractEndDate?: Date;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    buyBackValue?: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    immobilizationCode?: string;

    @IsOptional()
    @IsEnum(ExitTypeEnum)
    @Field((type) => ExitTypeEnum, { nullable: true })
    exitType?: ExitTypeEnum;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date, { nullable: true })
    mutationDate?: Date;

    @IsOptional()
    @IsEnum(SellTypeEnum)
    @Field((type) => SellTypeEnum, { nullable: true })
    sellType?: SellTypeEnum;

    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(CustomerExistConstraint, {})
    @Transform(({ value }) => CustomerEntity.init(value))
    customerAsCustomer?: CustomerEntity;

    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    customerAsEntity?: EntityEntity;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    sellingPrice: number;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    waitingForRelease?: boolean;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    geolocationBoxNumber: string;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    geolocationBoxMonthlyCost?: number;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Int, { nullable: true })
    geolocationContractStartDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Int, { nullable: true })
    geolocationContractEndDate?: Date;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    totalCard?: string;

    @IsOptional()
    @IsString()
    @Field((type) => Int, { nullable: true })
    angoPASS?: string;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    carFleetInsurance?: boolean;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    machineBreakdownInsurance?: boolean;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    breakEvent?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    useRate?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    nbHoursEntered?: number;

    @IsOptional()
    @Field((type) => [Employee], { nullable: true })
    usersToNotify?: number[];

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    comment?: string;
}
