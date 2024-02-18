import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EmployeeExistConstraint } from '../../constraints/employee.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class EmployeeRemoveArgInput {
    /**
     * Id of upload file
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public id?: number | Employee;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
