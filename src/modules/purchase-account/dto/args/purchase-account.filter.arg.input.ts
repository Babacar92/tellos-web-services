import { IsInt, IsOptional, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { SectionCodeExistConstraint } from "src/modules/section-code/constraints/section-code.exist.constraint";

/**
 * Input for to filter a new Quick Access
 */
export class PurchaseAccountFilterArgInput extends DatabaseFilterArg {

    
    /**
     * sectionCodeId for filter 
     */
    @IsOptional()
    @IsInt()
    @Validate(SectionCodeExistConstraint, {

    })
    public sectionCodeId?: number;
    
    /**
     * sectionCodeIds for filter
     */
    @IsOptional()
    @IsInt()
    @Validate(SectionCodeExistConstraint, {

    })
    public sectionCodeIds?: number[];

}