import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { SectionCodeEntity } from "src/entities/psql/SectionCodeEntity";
import { SectionCodeExistConstraint } from "src/modules/section-code/constraints/section-code.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class PurchaseAccountCreateArgInput {

    /**
     * The account of Purchasse Account
     */
    @IsOptional()
    @IsString()
    public account?: string;

    /**
     * sectionCode
     */
    @Validate(SectionCodeExistConstraint, {

    })
    @Transform(({ value }) => SectionCodeEntity.init(value))
    public sectionCode?: SectionCodeEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;

}