// NestJs
import { Field, Float, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

//Schemas

//Constraints
import { EquipmentParkWorkUnitTypeEnum } from '@/modules/equipments/enums/equipment-park-work-unit-type.enum';
import { MaintenanceStatusEnum } from '@/modules/equipments/enums/maintenance-status.enum';

//
@InputType()
export class UpdateEquipmentParkMaintenanceInput {
    @Field((type) => Int)
    id!: number;

    @IsOptional()
    @Field({ nullable: true })
    @IsString()
    operation?: string;

    @IsOptional()
    @Field((type) => Float, { nullable: true })
    @IsNumber()
    duration?: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    remark?: string;

    @IsOptional()
    @IsEnum(EquipmentParkWorkUnitTypeEnum)
    @Field((type) => EquipmentParkWorkUnitTypeEnum, { nullable: true })
    triggerUnit?: EquipmentParkWorkUnitTypeEnum;

    @IsOptional()
    @IsEnum(MaintenanceStatusEnum)
    @Field((type) => MaintenanceStatusEnum, { nullable: true })
    status?: MaintenanceStatusEnum;
}
