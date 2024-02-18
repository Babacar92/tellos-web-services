import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { QuickAccessEntity } from "../../../../entities/psql/QuickAccessEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { QuickAccessExistConstraint } from "../../constraints/quick-access.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class QuickAccessRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(QuickAccessExistConstraint, {

    })
    @Transform(({ value }) => QuickAccessEntity.init(value))
    public id?: number | QuickAccessEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}