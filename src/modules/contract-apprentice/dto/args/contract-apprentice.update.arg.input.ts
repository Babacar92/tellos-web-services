import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ContractApprenticeNotExistByColumnConstraint } from "../../constraints/contract-apprentice.not.exist.by.column.constraints";
import { ContractApprenticeExistConstraint } from "../../constraints/contract-apprentice.exist.constraint";

/**
 * Input for to update a new Employee Contract Apprentice
 */
export class ContractApprenticeUpdateArgInput {

    /**
     * The id of Employee Contract Apprentice
     */
    @IsNotEmpty()
    @Validate(ContractApprenticeExistConstraint, {

    })
    public id: number;

    /**
     * The title of Employee Contract apprentice
     */
    @IsOptional()
    @IsString()
    @Validate(ContractApprenticeNotExistByColumnConstraint, {

    })
    public title: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}