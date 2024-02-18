import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ContractTypeEntryNotExistByColumnConstraint } from "../../constraints/contract-type-entry.not.exist.by.column.constraints";
import { ContractTypeEntryExistConstraint } from "../../constraints/contract-type-entry.exist.constraint";

/**
 * Input for to update a new Employee Contract Type Entry
 */
export class ContractTypeEntryUpdateArgInput {

    /**
     * The id of Employee Contract Type Entry
     */
    @IsNotEmpty()
    @Validate(ContractTypeEntryExistConstraint, {

    })
    public id: number;

    /**
     * The title of employee contract type entry
     */
    @IsOptional()
    @IsString()
    @Validate(ContractTypeEntryNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}