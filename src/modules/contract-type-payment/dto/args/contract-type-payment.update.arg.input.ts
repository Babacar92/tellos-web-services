import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ContractTypePaymentNotExistByColumnConstraint } from "../../constraints/contract-type-payment.not.exist.by.column.constraints";
import { ContractTypePaymentExistConstraint } from "../../constraints/contract-type-payment.exist.constraint";

/**
 * Input for to update a new Employee Contract Type Entry
 */
export class ContractTypePaymentUpdateArgInput {

    /**
     * The id of Employee Contract Type Payment
     */
    @IsNotEmpty()
    @Validate(ContractTypePaymentExistConstraint, {

    })
    public id: number;

    /**
     * The title of employee contract type Payment
     */
    @IsOptional()
    @IsString()
    @Validate(ContractTypePaymentNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}