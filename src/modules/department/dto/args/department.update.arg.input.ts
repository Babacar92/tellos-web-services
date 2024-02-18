import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { DepartmentEntity } from '../../../../entities/psql/DepartmentEntity';
import { DepartmentExistConstraint } from '../../constraints/department.exist.constraint';
import { DepartmentNotExistByColumnConstraint } from '../../constraints/department.not.exist.by.column.constraints';

/**
 * Input for to update a new Quick Access
 */
export class DepartmentUpdateArgInput {
    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(DepartmentExistConstraint, {})
    @Transform(({ value }) => DepartmentEntity.init(value))
    public id: number;

    /**
     * The label of Quick Access
     */
    @IsOptional()
    @IsString()
    @Validate(DepartmentNotExistByColumnConstraint, {})
    public name?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
