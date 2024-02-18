import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { ContractSectionNotExistByColumnConstraint } from "../../constraints/contract-section.not.exist.by.column.constraints";

/**
 * Input for to create a new Employee Contract Section
 */
export class ContractSectionCreateArgInput {

    /**
     * The title of section
     */
    @IsString()
    @Validate( ContractSectionNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}