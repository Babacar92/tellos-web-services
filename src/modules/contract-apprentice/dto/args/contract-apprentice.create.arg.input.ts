import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import {ContractApprenticeNotExistByColumnConstraint } from "../../constraints/contract-apprentice.not.exist.by.column.constraints";

/**
 * Input for to create a new Employee Contract Apprentice
 */
export class ContractApprenticeCreateArgInput {

    /**
     * The title of Employee Contract apprentice
     */
    @IsString()
    @Validate(ContractApprenticeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}