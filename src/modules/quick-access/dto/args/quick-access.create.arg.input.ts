import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Employee } from '../../../../entities/psql/EmployeeEntity';

/**
 * Input for to create a new Quick Access
 */
export class QuickAccessCreateArgInput {
    /**
     * The label of Quick Access
     */
    @IsNotEmpty()
    @IsString()
    public label?: string;

    /**
     * The link of Quick Access
     */
    @IsNotEmpty()
    @IsString()
    public link?: string;

    /**
     * The color of Quick Access
     */
    @IsNotEmpty()
    @IsString()
    public color?: string;

    /**
     * The icon of Quick Access
     */
    @IsNotEmpty()
    @IsString()
    public icon?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

    /**
     * The employee of Quick Access
     */
    public employee?: Employee;
}
