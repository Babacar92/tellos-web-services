import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { MediumSizedCentreEntity } from "src/entities/psql/MediumSizedCentreEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { MediumSizedCentreExistConstraint } from "../../constraints/medium-sized-centre.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class MediumSizedCentreRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(MediumSizedCentreExistConstraint, {

    })
    @Transform(({ value }) => MediumSizedCentreEntity.init(value))
    public id?: number | MediumSizedCentreEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}