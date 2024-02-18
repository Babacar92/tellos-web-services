import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { ContractExistConstraint } from '../../../contract/constraints/contract.exist.constraint';
import { ContractEntity } from '../../../../entities/psql/ContractEntity';

/**
 * Input for to create a new Comment Contract
 */
export class ContractCommentCreateArgInput {
    /**
     * The comment of Comment Contract
     */
    @IsString()
    public comment?: string;

    /**
     * The employee
     */
    public employee?: number | Employee;

    /**
     * contract preview of comment
     */
    @Validate(ContractExistConstraint, {})
    @Transform(({ value }) => ContractEntity.init(value))
    public contract?: ContractEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;
}
