import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ArticleFamilyEntity } from "../../../../entities/psql/ArticleFamilyEntity";
import { ArticleFamilyExistConstraint } from "../../constraints/article-family.exist.constraint";
import { SectionCodeExistConstraint } from "../../../section-code/constraints/section-code.exist.constraint";
import { SectionCodeEntity } from "../../../../entities/psql/SectionCodeEntity";
import { SectionCodeForArticleFamilyConstraint } from "../../../../modules/section-code/constraints/section-code.for-article-family.constraints";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Input for to update a new Article Family
 */
export class ArticleFamilyUpdateArgInput {

    /**
     * The id of Article Family
     */
    @IsNotEmpty()
    @Validate(ArticleFamilyExistConstraint, {

    })
    @Transform(({ value }) => ArticleFamilyEntity.init(value))
    public id: number;

    /**
     * The section code of the article family
     */
    @IsOptional()
    @Validate(SectionCodeExistConstraint)
    @Validate(SectionCodeForArticleFamilyConstraint, process.env.ACCEPTED_EXPENSE_POST_FOR_ARTICLE_FAMILY_SECTION_CODE.split(','))
    @Transform(({ value }) => SectionCodeEntity.init(value))
    public sectionCode?: number | SectionCodeEntity;

    /**
     * The parent Article Family
     */
    @IsOptional()
    @Validate(ArticleFamilyExistConstraint)
    @Transform(({ value }) => ArticleFamilyEntity.init(value))
    public parent?: number | ArticleFamilyEntity;

    /**
     * The children Article Family
     */
    @IsOptional()
    @Validate(ArticleFamilyExistConstraint, {
        each: true
    })
    @Transform(({ value }) =>  value.map(item => ArticleFamilyEntity.init(item)))
    public children?: number[] | ArticleFamilyEntity[];

    /**
     * The label of Article Family
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}