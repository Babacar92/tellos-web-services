import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { ContractExistConstraint } from '../../constraints/contract.exist.constraint';
import { Transform } from 'class-transformer';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { CONTRACT_STATUS_ICON } from '../../../contract-info/dto/enums/contract-info.enum';
import { ContractInfoExistConstraint } from '../../../contract-info/constraints/contract-info.exist.constraint';
import { ContractInfoEntity } from '../../../../entities/psql/ContractInfoEntity';

/**
 * Input for to update a new Contract Preview
 */
export class ContractUpdateArgInput {
    /**
     * The id of Employee Contract
     */
    @IsNotEmpty()
    @Validate(ContractExistConstraint, {})
    public id: number;

    /**
     * text
     */
    @IsOptional()
    @IsString()
    public text?: string;

    /**
     * text
     */
    @IsOptional()
    @IsString()
    public filename?: string;

    /**
     * status
     */
    @IsOptional()
    @IsEnum(CONTRACT_STATUS_ICON)
    public status?: CONTRACT_STATUS_ICON;

    /**
     * employee
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(
        ({ value }) =>
            new Employee({
                id: value,
            }),
    )
    public employee?: Employee;

    /**
     * info
     */
    @IsOptional()
    @Validate(ContractInfoExistConstraint, {})
    @Transform(({ value }) => ContractInfoEntity.init(value))
    public info?: ContractInfoEntity;

    /**
     * type of contract
     */
    @IsOptional()
    @IsEnum(ContractEnum)
    public type?: ContractEnum;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

    /**
     * Is Generate
     */
    @IsOptional()
    @IsBoolean()
    public isSigned?: boolean;

    /**
     * text
     */
    @IsOptional()
    @IsString()
    public youSignSignatureRequestId?: string;

    /**
     * text
     */
    @IsOptional()
    @IsString()
    public youSignDocumentId?: string;

    /**
     * text
     */
    @IsOptional()
    @IsString()
    public youSignTargetUserToSignId?: string;
}
