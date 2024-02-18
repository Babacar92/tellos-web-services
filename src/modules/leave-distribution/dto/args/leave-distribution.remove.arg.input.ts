import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { LeaveDistributionEntity } from "src/entities/psql/LeaveDistributionEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { LeaveDistributionExistConstraint } from "../../constraints/leave-distribution.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class LeaveDistributionRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(LeaveDistributionExistConstraint, {

    })
    @Transform(({ value }) => LeaveDistributionEntity.init(value))
    public id?: number | LeaveDistributionEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}