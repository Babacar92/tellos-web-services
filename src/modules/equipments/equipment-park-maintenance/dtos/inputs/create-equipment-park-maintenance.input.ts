// NestJs
import { Field, Float, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas

//Constraints
import { EquipmentParkExistConstraint } from '../../../equipment-park/equipment-park.exist.constraint';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';

@InputType()
export class CreateEquipmentParkMaintenanceInput {
    @Field((type) => Int)
    @IsOptional()
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    equipmentPark!: EquipmentPark;

    @Field()
    @IsString()
    operation!: string;

    @Field((type) => Float)
    @IsNumber()
    duration!: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    remark?: string;
}
