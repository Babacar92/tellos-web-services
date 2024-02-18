import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { PurchaseAccountExistConstraint } from "../../constraints/purchase-account.exist.constraint";
import { Transform } from "class-transformer";
import { SectionCodeExistConstraint } from "src/modules/section-code/constraints/section-code.exist.constraint";
import { SectionCodeEntity } from "src/entities/psql/SectionCodeEntity";

/**
 * Input for to update a new Quick Access
 */
export class PurchaseAccountUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(PurchaseAccountExistConstraint, {

    })
    public id: number;

    /**
     * The account of Purchasse Account
     */
    @IsOptional()
    @IsInt()
    public account?: string;

    /**
     * sectionCode
     */
    @IsOptional()
    @Validate(SectionCodeExistConstraint, {

    })
    @Transform(({ value }) => SectionCodeEntity.init(value))
    public sectionCode?: SectionCodeEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}