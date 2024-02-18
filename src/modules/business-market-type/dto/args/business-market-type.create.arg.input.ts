import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessMarketTypeNotExistByColumnConstraint } from "../../constraints/business-market-type.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessMarketTypeCreateArgInput {

    /**
     * The title of Business market typetitle
     */
    @IsString()
    @Validate(BusinessMarketTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}