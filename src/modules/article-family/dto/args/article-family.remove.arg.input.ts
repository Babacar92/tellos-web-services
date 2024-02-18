import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ArticleFamilyEntity } from "../../../../entities/psql/ArticleFamilyEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ArticleFamilyExistConstraint } from "../../constraints/article-family.exist.constraint";

/**
 * Input for to create a new Article Family
 */
export class ArticleFamilyRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(ArticleFamilyExistConstraint, {

    })
    @Transform(({ value }) => ArticleFamilyEntity.init(value))
    public id?: number | ArticleFamilyEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}