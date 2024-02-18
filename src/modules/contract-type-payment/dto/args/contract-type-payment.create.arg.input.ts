import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { ContractTypePaymentNotExistByColumnConstraint } from "../../constraints/contract-type-payment.not.exist.by.column.constraints";

/**
 * Input for to create a new Employee Contract Type Payment
 */
export class ContractTypePaymentCreateArgInput {

    /**
     * The title of employee contract type Payment
     */
    @IsString()
    @Validate(ContractTypePaymentNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}