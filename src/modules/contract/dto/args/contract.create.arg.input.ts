import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { CONTRACT_STATUS_ICON } from '../../../contract-info/dto/enums/contract-info.enum';

/**
 * Input for to create a new Contract Preview
 */
export class ContractCreateArgInput {
    /**
     * text
     */
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
    public status?: CONTRACT_STATUS_ICON = CONTRACT_STATUS_ICON.GRAY;

    /**
     * employee
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * type of contract
     */
    @IsEnum(ContractEnum)
    public type?: ContractEnum;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;

    @IsOptional()
    @IsBoolean()
    public isSigned?: boolean = false;
}
