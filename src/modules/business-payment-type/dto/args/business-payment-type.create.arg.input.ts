import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessPaymentTypeNotExistByColumnConstraint } from "../../constraints/business-payment-type.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessPaymentTypeCreateArgInput {

    /**
     * The title of Business payment typetitle
     */
    @IsString()
    @Validate(BusinessPaymentTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}