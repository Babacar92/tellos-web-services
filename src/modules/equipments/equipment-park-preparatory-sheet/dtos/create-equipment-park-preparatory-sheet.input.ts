import { Employee } from '@/entities/psql/EmployeeEntity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { EquipmentParkExistConstraint } from '../../equipment-park/equipment-park.exist.constraint';
import { EmployeeExistConstraint } from '@/modules/employee/constraints/employee.exist.constraint';

@InputType()
export class CreateEquipmentParkPreparatorySheetInput {
    @Field((type) => Int)
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    equipmentPark!: EquipmentPark;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    dieselCardReturned?: boolean;

    @IsOptional()
    @Field((type) => Int, {nullable: true})
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    dieselCardReturnedTo?: Employee;

    @IsOptional()
    @IsBoolean()
    @Field()
    chipRemovedAndReturned!: boolean;

    @IsOptional()
    @Field((type) => Int, {nullable: true})
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    chipRemovedAndReturnedTo?: Employee;

    @IsOptional()
    @IsBoolean()
    @Field({nullable: true})
    originalRegistrationDocument?: boolean;

    @IsOptional()
    @IsBoolean()
    @Field({nullable: true})
    duplicateKeys?: boolean;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    insuranceWithdrawn?: boolean;

    @IsBoolean()
    @Field()
    vehicleEmpty!: boolean;

    @IsBoolean()
    @Field()
    isMarkingRemoved!: boolean;

    @IsBoolean()
    @Field()
    starts!: boolean;

    @IsBoolean()
    @Field()
    RollingVehicule: boolean;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    mainWorks?: string;
}
