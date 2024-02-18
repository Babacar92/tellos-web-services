import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ParagraphFrameExistConstraint } from "../../constraints/paragraph-frame.exist.constraint";
import { ParagraphFrameEntity } from "src/entities/psql/ParagraphFrameEntity";

/**
 * Input for to create a new Quick Access
 */
export class ParagraphFrameRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(ParagraphFrameExistConstraint, {

    })
    @Transform(({ value }) => ParagraphFrameEntity.init(value))
    public id?: number | ParagraphFrameEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}