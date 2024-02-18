import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { InseeCodeEntity } from "src/entities/psql/InseeCodeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { InseeCodeExistConstraint } from "../../constraints/insee-code.exist.constraint";

/**
 * Input for to remove a Insee Code
 */
export class InseeCodeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(InseeCodeExistConstraint, {

    })
    @Transform(({ value }) => InseeCodeEntity.init(value))
    public id?: number | InseeCodeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}