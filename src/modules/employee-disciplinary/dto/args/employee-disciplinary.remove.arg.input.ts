import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { EmployeeDisciplinaryEntity } from "src/entities/psql/EmployeeDisciplinaryEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { EmployeeDisciplinaryExistConstraint } from "../../constraints/employee-disciplinary.exist.constraint";

/**
 * Input for to remove a Employee Disciplinary
 */
export class EmployeeDisciplinaryRemoveArgInput {

    /**
     * Id of EmployeeDisciplinary
     */
    @Validate(EmployeeDisciplinaryExistConstraint, {

    })
    @Transform(({ value }) => EmployeeDisciplinaryEntity.init(value))
    public id?: number | EmployeeDisciplinaryEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}