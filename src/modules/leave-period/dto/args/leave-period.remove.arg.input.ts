import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { LeavePeriodExistConstraint } from "../../constraints/leave-period.exist.constraint";
import { LeavePeriodEntity } from "src/entities/psql/LeavePeriodEntity";

/**
 * Input for to remove a new LeavePeriod
 */
export class LeavePeriodRemoveArgInput {

    /**
     * Id of LeavePeriod
     */
    @Validate(LeavePeriodExistConstraint, {

    })
    @Transform(({ value }) => LeavePeriodEntity.init(value))
    public id?: number | LeavePeriodEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}