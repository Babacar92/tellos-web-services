import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { BusinessPaymentModeNotExistByColumnConstraint } from "../../constraints/business-payment-mode.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class BusinessPaymentModeCreateArgInput {

    /**
     * The title of Business payment modetitle
     */
    @IsString()
    @Validate(BusinessPaymentModeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}