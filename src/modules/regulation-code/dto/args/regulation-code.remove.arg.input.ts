import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RegulationCodeEntity } from "src/entities/psql/RegulationCodeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { RegulationCodeExistConstraint } from "../../constraints/regulation-code.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class RegulationCodeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(RegulationCodeExistConstraint, {

    })
    @Transform(({ value }) => RegulationCodeEntity.init(value))
    public id?: number | RegulationCodeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}