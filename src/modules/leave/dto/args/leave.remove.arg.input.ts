import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { LeaveExistConstraint } from "../../constraints/leave.exist.constraint";
import { LeaveEntity } from "src/entities/psql/LeaveEntity";
/**
 * Input for to remove a new Leave
 */
export class LeaveRemoveArgInput {

    /**
     * Id of Leave
     */
    @Validate(LeaveExistConstraint, {

    })
    @Transform(({ value }) => LeaveEntity.init(value))
    public id?: number | LeaveEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}