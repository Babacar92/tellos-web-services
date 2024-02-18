import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import {  ContractSectionNotExistByColumnConstraint } from "../../constraints/contract-section.not.exist.by.column.constraints";
import {  ContractSectionExistConstraint } from "../../constraints/contract-section.exist.constraint";

/**
 * Input for to update a new Employee Contract Section
 */
export class ContractSectionUpdateArgInput {

    /**
     * The id of Employee Contract Section
     */
    @IsNotEmpty()
    @Validate( ContractSectionExistConstraint, {

    })
    public id: number;

    /**
     * The title of section 
     */
    @IsOptional()
    @IsString()
    @Validate(ContractSectionNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}