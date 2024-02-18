import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { BusinessPaymentTypeNotExistByColumnConstraint } from "../../constraints/business-payment-type.not.exist.by.column.constraints";
import { BusinessPaymentTypeExistConstraint } from "../../constraints/business-payment-type.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessPaymentTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessPaymentTypeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Business payment typetitle
     */
    @IsOptional()
    @IsString()
    @Validate(BusinessPaymentTypeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}