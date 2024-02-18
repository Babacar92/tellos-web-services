import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * Input for to create a new Quick Access
 */
export class TheoreticalHoursOfUseCreateArgInput {

    /**
     * number of hours of theoretical hours of use
     */
    @IsNumber()
    public hoursNumber?: number;

    /**
   * year of theoretical hours of use
   */
    @IsOptional()
    @IsString()
    public year?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}