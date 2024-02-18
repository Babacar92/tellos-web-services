import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessMarketTypeNotExistByColumnConstraint } from "../../constraints/business-market-type.not.exist.by.column.constraints";
import { BusinessMarketTypeExistConstraint } from "../../constraints/business-market-type.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessMarketTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessMarketTypeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business market typetitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessMarketTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}