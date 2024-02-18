import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { TheoreticalHoursOfUseEntity } from "src/entities/psql/TheoreticalHoursOfUseEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { TheoreticalHoursOfUseExistConstraint } from "../../constraints/theoretical-hours-of-use.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class TheoreticalHoursOfUseRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(TheoreticalHoursOfUseExistConstraint, {

    })
    @Transform(({ value }) => TheoreticalHoursOfUseEntity.init(value))
    public id?: number | TheoreticalHoursOfUseEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}