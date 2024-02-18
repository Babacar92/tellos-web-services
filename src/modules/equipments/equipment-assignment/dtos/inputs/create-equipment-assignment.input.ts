// NestJs
import { Field, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { IsDate, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';
import { Employee } from 'src/entities/psql/EmployeeEntity';

//Constraints
import { EquipmentParkExistConstraint } from '../../../equipment-park/equipment-park.exist.constraint';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';

@InputType()
export class CreateEquipmentAssignmentInput {
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    @Field((type) => Int)
    equipmentPark: EquipmentPark;

    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    @Field((type) => Int)
    employee: Employee;

    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Date)
    startDate: Date;
}
