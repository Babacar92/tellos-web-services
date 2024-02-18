import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ContractLevelNotExistByColumnConstraint } from "../../constraints/contract-level.not.exist.by.column.constraints";
import { ContractLevelExistConstraint } from "../../constraints/contract-level.exist.constraint";

/**
 * Input for to update a new Employee Contract Level
 */
export class  ContractLevelUpdateArgInput {

    /**
     * The id of Employee Contract Level
     */
    @IsNotEmpty()
    @Validate(ContractLevelExistConstraint, {

    })
    public id: number;

    /**
     * The title of Employee Contract Level
     */
    @IsOptional()
    @IsString()
    @Validate(ContractLevelNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}