import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { ContractTypeEntryNotExistByColumnConstraint } from "../../constraints/contract-type-entry.not.exist.by.column.constraints";

/**
 * Input for to create a new Employee Contract Type Entry
 */
export class ContractTypeEntryCreateArgInput {

    /**
     * The title of employee contract type entry
     */
    @IsString()
    @Validate(ContractTypeEntryNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}