import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { ContractCommentExistConstraint } from "../../constraints/contract-comment.exist.constraint";
import { Transform } from "class-transformer";
import { ContractExistConstraint } from "src/modules/contract/constraints/contract.exist.constraint";
import { ContractEntity } from "src/entities/psql/ContractEntity";

/**
 * Input for to update a new Comment Contract
 */
export class ContractCommentUpdateArgInput {

    /**
     * The id of Comment Contract
     */
    @IsNotEmpty()
    @Validate(ContractCommentExistConstraint, {

    })
    public id: number;

    /**
     * The comment of Comment Contract
    */
    @IsString()
    public comment?: string;

    /**
     * contract preview of comment
     */
    @Validate(ContractExistConstraint, {

    })
    @Transform(({ value }) => ContractEntity.init(value))
    public contract?: ContractEntity;
  
    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}