import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { DepartmentNotExistByColumnConstraint } from '../../constraints/department.not.exist.by.column.constraints';

/**
 * Input for to create a new Quick Access
 */
export class DepartmentCreateArgInput {
    /**
     * The label of Quick Access
     */
    @IsNotEmpty()
    @IsString()
    @Validate(DepartmentNotExistByColumnConstraint, {})
    public name?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;
}
