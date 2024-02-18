import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { QuickAccessEntity } from '../../../../entities/psql/QuickAccessEntity';
import { Employee } from '../../../../entities/psql/EmployeeEntity';
import { QuickAccessExistConstraint } from '../../constraints/quick-access.exist.constraint';

/**
 * Input for to update a new Quick Access
 */
export class QuickAccessUpdateArgInput {
    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(QuickAccessExistConstraint, {})
    @Transform(({ value }) => QuickAccessEntity.init(value))
    public id: number;

    /**
     * The label of Quick Access
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * The link of Quick Access
     */
    @IsOptional()
    @IsString()
    public link?: string;

    /**
     * The color of Quick Access
     */
    @IsOptional()
    @IsString()
    public color?: string;

    /**
     * The icon of Quick Access
     */
    @IsOptional()
    @IsString()
    public icon?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

    /**
     * The employee of Quick Access
     */
    public employee?: Employee;
}
