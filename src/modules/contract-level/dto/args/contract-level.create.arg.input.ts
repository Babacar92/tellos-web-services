import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { ContractLevelNotExistByColumnConstraint } from "../../constraints/contract-level.not.exist.by.column.constraints";

/**
 * Input for to create a Employee Contract Level
 */
export class ContractLevelCreateArgInput {

    /**
     * The title of Employee Contract Level
     */
    @IsString()
    @Validate(ContractLevelNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}