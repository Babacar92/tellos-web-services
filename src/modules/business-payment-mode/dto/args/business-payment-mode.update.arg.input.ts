import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessPaymentModeNotExistByColumnConstraint } from "../../constraints/business-payment-mode.not.exist.by.column.constraints";
import { BusinessPaymentModeExistConstraint } from "../../constraints/business-payment-mode.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessPaymentModeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessPaymentModeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business payment modetitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessPaymentModeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}