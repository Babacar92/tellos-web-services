// NestJs
import { Field, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { IsDate, IsOptional, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { DocumentTypeEntity } from '@/entities/psql/DocumentTypeEntity';

//Constraints
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { DocumentTypeExistConstraint } from '@/modules/document-type/constraints/document-type.exist.constraint';
import { LoginEntity } from '@/entities/psql/LoginEntity';

@InputType()
export class UpdateEquipmentParkObservationInput {

    public login?: LoginEntity;

    @Field((type) => Int)
    id!: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    title?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    description?: string;

    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(DocumentTypeExistConstraint, {})
    @Transform(({ value }) => DocumentTypeEntity.init(value))
    type?: DocumentTypeEntity;

    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    user?: Employee;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Int, { nullable: true })
    addDate?: Date;
}
