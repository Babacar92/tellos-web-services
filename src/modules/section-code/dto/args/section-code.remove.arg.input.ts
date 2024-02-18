import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { SectionCodeEntity } from "src/entities/psql/SectionCodeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { SectionCodeExistConstraint } from "../../constraints/section-code.exist.constraint";

/**
 * Input for to remove a Section Code
 */
export class SectionCodeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(SectionCodeExistConstraint, {

    })
    @Transform(({ value }) => SectionCodeEntity.init(value))
    public id?: number | SectionCodeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}