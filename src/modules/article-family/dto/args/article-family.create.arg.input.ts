import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ArticleFamilyEntity } from "../../../../entities/psql/ArticleFamilyEntity";
import { ArticleFamilyExistConstraint } from "../../constraints/article-family.exist.constraint";
import { Transform } from "class-transformer";
import { SectionCodeExistConstraint } from "../../../../modules/section-code/constraints/section-code.exist.constraint";
import { SectionCodeEntity } from "../../../../entities/psql/SectionCodeEntity";
import { SectionCodeForArticleFamilyConstraint } from "../../../../modules/section-code/constraints/section-code.for-article-family.constraints";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Input for to create a new Article Family
 */
export class ArticleFamilyCreateArgInput {

    /**
     * The label of Article Family
     */
    @IsNotEmpty()
    @IsString()
    public label?: string;

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
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;
}